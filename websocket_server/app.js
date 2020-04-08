// Redis Init
const redis = require("redis");
const redisClient = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || "localhost",
  {
    prefix: "session",
  }
);
const SESSION_EXPIRE_TIME = 7200; // in seconds

// DB api init
const db = require("./database");

// Python api init
const python = require("./python");

// Express init
const http = require("http");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { body } = require("express-validator");
const bodyParser = require("body-parser");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static("build"));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body, req.query);
  next();
});

const sessionParser = session({
  secret: process.env.SESSION_SECRET || "d3f4ults3cr3t",
  resave: false,
  saveUninitialized: true,
  // cookie: { httpOnly: true, secure: true, sameSite: true }
});

app.use(sessionParser);

let authenticated = (req, res, next) => {
  if (!req.session.user) return res.status(401).end("Access denied");
  next();
};

// Health Check
app.get("/health", (req, res) => {
  return res.status(200).end("OK");
});

// Authentication Logic based off of code from CSCC09 Lab 06
// Sign up
app.post(
  "/api/signup",
  [body("role"), body("username").escape(), body("password").escape()],
  (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;
    let name = req.body.name;
    db.addUser(role, username, password, name, (err, user) => {
      if (err) return res.status(500).end(err.message);
      req.session.user = user;
      req.session.classes = [];
      req.session.currSession = null;
      console.log(user);
      console.log("1");
      return res.json(user);
    });
  }
);

app.post(
  "/api/login",
  [body("username").escape(), body("password").escape()],
  (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    db.checkUser(username, password, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).end(err.message);
      }
      db.findClasses(user.username, (err, classes) => {
        if (err) {
          console.log(err);
          return res.status(500).end(err.message);
        }
        console.log(classes);
        req.session.user = user;
        req.session.classes = classes;
        req.session.currSession = null;
        console.log(req.session);
        return res.json(user);
      });
    });
  }
);

app.get("/api/signout", authenticated, (req, res, next) => {
  req.session.destroy();
  res.json("Signed out");
});

// Course and sessions logic
app.post(
  "/api/createSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    db.isStudent(req.session.user.username, (err, isStudent) => {
      if (err) return res.status(500).end(err.message);
      // Not a student
      if (!isStudent) {
        // Valid instructor
        if (req.session.classes.includes(parseInt(req.body.course))) {
          req.session.currSession = req.body.course;
          console.log(`creating session ${req.body.course}SESSION`);
          redisClient.set(`${req.body.course}SESSION`, "");
          redisClient.expire(`${req.body.course}SESSION`, SESSION_EXPIRE_TIME);
          redisClient.hset(req.body.course, "startedBy", req.session.user.id);
          redisClient.hset(req.body.course, "code", "");
          redisClient.expire(req.body.course, SESSION_EXPIRE_TIME);
          // Remove any old suggestions
          redisClient.del(`${req.body.course}SUGGESTIONS`);
          return res.json("CREATED");
        }
        // db.verifyPersonClass(
        //   req.session.user.username,
        //   req.body.course,
        //   req.session.user.roleId,
        //   (err, res) => {
        //     if (err) return res.status(500).end(err);
        //     if (res) {
        //       let session = uuid();
        //       res.session.sessionId = session;
        //       redisClient.hmset();
        //     }
        //   }
        // );
      }
      return res.status(401).end("Access denied");
    });
  }
);

app.delete(
  "/api/deleteSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    redisClient.hget(req.body.course, "startedBy", (err, id) => {
      if (id == req.session.user.id) {
        redisClient.del(`${req.body.course}SESSION`, (number) => {
          redisClient.del(req.body.course, (number) => {
            redisClient.del(`${req.body.course}SESSION`);

            return res.json(`${number} session(s) deleted`);
          });
        });
      } else {
        return res
          .status(401)
          .end(`Not leading session for ${req.body.course}`);
      }
    });

    // db.isStudent(req.session.user.username, (err, isStudent) => {
    //   if (err) return res.status(500).end(err.message);
    //   // Verify they are the person who started the session
    //   redisClient.hget(req.body.course, "startedBy", (err, id) => {
    //     if (id == req.session.user.id) {
    //       redisClient.del(req.body.course, number => {
    //         return res.json(`${number} session(s) deleted`);
    //       });
    //     } else {
    //       return res
    //         .status(401)
    //         .end(`Not leading session for ${req.body.course}`);
    //     }
    //   });

    //   if (!isStudent) {
    //     // Valid instructor
    //     if (req.session.currSession === req.body.course) {
    //       req.session.currSession = req.body.course;
    //       redisClient.del(req.body.course, number => {
    //         return res.json(`${number} session(s) deleted`);
    //       });
    //     } else {
    //       res.status(401).end(`Not leading session for ${req.body.course}`);
    //     }
    //   }
    //   return res.status(401).end("Access denied");
    // });
  }
);

app.post("/api/addstudenttocourse/", authenticated, (req, res, next) => {
  let studentID = req.body.studentID;
  let courseID = req.body.courseID;
  db.addStudentToCourse(studentID, courseID, (err, results) => {
    if (err) {
      return res.status(500).end(err.message);
    }
    return res.json("Successfully added student to course");
  });
});

app.post("/api/searchstudent/", authenticated, (req, res, next) => {
  let searchQuery = req.body.query;
  db.searchStudent(searchQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).end(err.message);
    }
    console.log(results);
    return res.json(results);
  });
});

app.get("/api/classes", authenticated, (req, res, next) => {
  console.log(req.session.classes);
  res.json(req.session.classes);
});

app.get("/api/students", authenticated, (req, res, next) => {
  let page = req.query.page || 0;
  db.getStudents(page, (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.status(500).end(err.message);
    }
    return res.json(results);
  });
});

app.get("/api/getallcourses", authenticated, (req, res, next) => {
  db.getCourses((err, results, fields) => {
    if (err) return res.status(500).end(err.message);
    return res.json(results);
  });
});

app.get("/api/sessions", authenticated, (req, res, next) => {
  console.log(req.session.classes);
  if (req.session.classes.length === 0) {
    return res.json([]);
  }
  console.log("Looking for");
  console.log(
    req.session.classes.map((val) => {
      return `${val}SESSION`;
    })
  );
  redisClient.mget(
    req.session.classes.map((val) => {
      return `${val}SESSION`;
    }),
    (err, results) => {
      console.log(err);
      if (err) return res.status(500).end("Internal Server error");

      console.log("GETTING ALL VALID SESSIONS");
      console.log(results);

      let ret = [];
      req.session.classes.forEach((course, index) => {
        // console.log(res)
        if (results[index] !== null) {
          ret.push(course);
        }
      });
      console.log(ret);
      return res.json(ret);
    }
  );
});

app.post(
  "/api/connectSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    if (req.session.classes.includes(parseInt(req.body.course))) {
      redisClient.exists(req.body.course, (err, exists) => {
        console.log(exists);
        if (exists) {
          req.session.currSession = req.body.course;
          return res.json("OK");
        }
        return res.status(401).end("No Session Exists");
      });
    } else {
      return res.status(401).end("Access denied");
    }
  }
);

// Python stuff

app.post("/api/python", authenticated, (req, res, next) => {
  let code = req.body.code;
  const from = "PYTHON";
  if (!code) {
    return res.status(400).end("Bad Request");
  }
  python.executePython(
    code,
    (output) => {
      console.log(`out ${output}`);
      sendClients(req.session.currSession, output, from);
    },
    (err) => {
      console.log(`err ${err}`);
      sendClients(req.session.currSession, err, from);
    },
    (exitCode) => {
      console.log(`Python exited with code ${exitCode}`);
      return res.json("OK");
    }
  );
});

let sendClients = (course, data, from) => {
  let ret = {
    from: from,
    message: data,
  };
  wss.clients.forEach((client) => {
    if (client.course === course) {
      client.send(JSON.stringify(ret));
    }
  });
};

// Web socket authentication based off of https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js

// Websocket init
const WebSocket = require("ws");
const url = require("url");
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

wss.on("session", (ws, req) => {
  console.log("ASOIDJASOIDJAOSIJ");
  ws.course = req.session.currSession;
  // Instructor logic

  ws.on("message", (message) => {
    // parse string
    // console.log("message Msg")
    // console.log(message)

    let parsedMsg = JSON.parse(message);
    // console.log("parsed Msg")
    // console.log(parsedMsg)

    let ret;
    // console.log(`Got the parsedMsg ${parsedMsg}`)
    // console.log(`Got the message ${parsedMsg.message}`);
    // TA CODE
    if (
      req.session.user.role === "TEACHING ASSISTANT" &&
      parsedMsg.type == "CODE"
    ) {
      console.log("TA MESSAGE");

      redisClient.hset(ws.course, "code", parsedMsg.message);
      ret = {
        type: "CODE",
        from: req.session.user.role,
        message: parsedMsg.message,
      };
    } else if (parsedMsg.type == "CHAT") {
      // console.log("CHAT MESSAGE");
      // console.log(parsedMsg.message)

      redisClient.rpush(`${req.session.currSession}CHAT`, parsedMsg.message);

      return redisClient.lrange(
        `${req.session.currSession}CHAT`,
        0,
        -1,
        (err, res) => {
          // console.log("res redis");
          // console.log(res);
          ret = {
            type: "CHAT", //TODO: secure this?
            from: req.session.user.role,
            message: res,
          };
          wss.clients.forEach((client) => {
            if (client.course === ws.course) {
              client.send(JSON.stringify(ret));
            }
          });
        }
      );
    } else {
      console.log("STUDENT SUGGESTIONS");
      console.log(parsedMsg.message);
      console.log(parsedMsg.lineNum);
      // Student suggestions
      redisClient.sadd(
        `${req.session.currSession}SUGGESTIONS`,
        `${parsedMsg.lineNum} ${parsedMsg.message}`
      );
      return redisClient.smembers(
        `${req.session.currSession}SUGGESTIONS`,
        (err, suggestions) => {
          if (err) return res.status(500).end("Internal server error");
          ret = {
            type: "SUGGESTION",
            from: req.session.user.role,
            message: suggestions.map((suggestion) => {
              // Split into line number and code
              let firstSpace = suggestion.indexOf(" ") + 1;
              return {
                lineNum: suggestion.substring(0, firstSpace),
                suggestion: suggestion.substring(firstSpace),
              };
            }),
          };
          wss.clients.forEach((client) => {
            if (client.course === ws.course) {
              client.send(JSON.stringify(ret));
            }
          });
        }
      );
    }
    wss.clients.forEach((client) => {
      if (client.course === ws.course) {
        client.send(JSON.stringify(ret));
      }
    });
  });

  redisClient.hget(req.session.currSession, "code", (err, res) => {
    if (err) {
      console.log(err);
      return ws.send("Error retrieving initial message");
    }
    console.log(res);
    let ret = {
      from: "TEACHING ASSISTANT",
      message: res,
    };
    return ws.send(JSON.stringify(ret));
  });
});

server.on("upgrade", (req, socket, head) => {
  console.log("ASOIDHJAOSIJ");

  const pathname = url.parse(req.url).pathname;
  const protocol = req.headers["sec-websocket-protocol"];
  console.log("ASOIDHJAOSIJ");
  // Necessary because we only set express app to use parser, not the http server
  sessionParser(req, {}, () => {
    console.log(req.session);
    if (!req.session.user) {
      return socket.destroy();
    }
    if (pathname === "/api/session") {
      console.log("YEEE");
      console.log(req.session.currSession);
      redisClient.exists(req.session.currSession, (err, exists) => {
        if (exists) {
          return wss.handleUpgrade(req, socket, head, (ws) => {
            console.log("Emitting request");
            wss.emit("session", ws, req);
          });
        }
        console.log("YasdsEEE");

        return socket.destroy();
      });
    } else {
      return socket.destroy();
    }
  });
});

server.listen(8080);
