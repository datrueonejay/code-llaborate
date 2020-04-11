// Redis Init
const redis = require("redis");
const redisClient = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || "localhost",
  {
    prefix: "session",
  }
);
const crypto = require("crypto");
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
const nodemailer = require("nodemailer");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static("build"));

// redisClient.set("courseCodes", JSON.stringify({}));

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

let isInstructor = (req, res, next) => {
  console.log("session", req.session);
  console.log("role", req.session.user.role);
  if (!req.session.user.role === "INSTRUCTOR")
    return res.status(401).end("Access denied");
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
    if (!username || !password || !role || !name) {
      return res.status(400).end("Bad request");
    }
    db.addUser(role, username, password, name, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(400).end(err);
      }
      req.session.user = user;
      req.session.classes = [];
      req.session.currSession = null;
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
    if (!username || !password) {
      return res.status(400).end("Bad request");
    }

    return db.checkUser(username, password, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).end("Invalid Username and Password Combination");
      }
      return db.findClasses(user.username, (err, classes) => {
        if (err) {
          console.error(err);
          return res.status(500).end(err);
        }
        req.session.user = user;
        req.session.classes = classes;
        req.session.currSession = null;
        return res.json(user);
      });
    });
  }
);

app.get("/api/signout", authenticated, (req, res, next) => {
  req.session.destroy();
  return res.json("Signed out");
});

app.post(
  "/api/joincourse",
  authenticated,
  [body("courseCode").escape()],
  (req, res, next) => {
    let courseCode = req.body.courseCode;
    return getCourseIdFromCode(courseCode).then((courseID) => {
      userID = req.session.user.id;
      console.log(courseID);
      console.log(userID);
      return db.checkCourse(courseID, (err, results) => {
        console.log(err);
        if (err) return res.status(400).end("Bad request");

        // if course found
        if (results.length > 0) {
          return db.addToCourse(userID, courseID, (err, results) => {
            console.log(err);

            if (err) return res.status(400).end("Bad request");

            return db.findClasses(req.session.user.username, (err, classes) => {
              if (err) {
                console.log(err);
                return res.status(500).end(err.message);
              }
              req.session.classes = classes;
              return res.json(classes);
            });

            return res.json(results);
          });
        }
      });
    });
  }
);

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
          return redisClient.exists(`${req.body.course}SESSION`, (err, num) => {
            // If session already exists
            if (num > 0) {
              return res.status(400).end("Session already exists");
            } else {
              // Session does not exist
              req.session.currSession = req.body.course;
              redisClient.set(`${req.body.course}SESSION`, "", (err, reply) => {
                if (err) {
                  return res.status(500).end("Internal Server Error");
                }
                redisClient.expire(
                  `${req.body.course}SESSION`,
                  SESSION_EXPIRE_TIME
                );
              });

              redisClient.hmset(
                req.body.course,
                "code",
                "",
                "startedBy",
                req.session.user.id,
                "suggestions",
                JSON.stringify([]),
                "chat",
                JSON.stringify([]),
                (err, reply) => {
                  if (err) {
                    return res.status(500).end("Internal Server Error");
                  }
                  redisClient.expire(req.body.course, SESSION_EXPIRE_TIME);
                }
              );
              // redisClient.hset(
              //   req.body.course,
              //   "startedBy",
              //   req.session.user.id
              // );
              // redisClient.hset(req.body.course, "code", "");
              // redisClient.expire(req.body.course, SESSION_EXPIRE_TIME);
              // // Remove any old suggestions
              // redisClient.del(`${req.body.course}SUGGESTIONS`);
              return res.json("CREATED");
            }
          });
        }
      }
      return res.status(401).end("Access denied");
    });
  }
);

app.post(
  "/api/createCourseCode",
  isInstructor,
  [body("courseID").escape()],
  (req, res, next) => {
    let courseID = req.body.courseID;
    let courseCodes;

    // Check if the hash with course code key exists

    // If not, create the hash with the key and value of random string

    //
    return db.checkCourse(courseID, (err, result) => {
      if (err) return res.status(422).end("Bad input");
      return redisClient.hget("courseCodes", courseID, (err, reply) => {
        console.log(err);
        if (err) return res.status(500).end("Internal Server Error");
        console.log(reply);
        if (!reply) {
          let code = crypto
            .createHash("md5")
            .update(req.body.courseID + Date.now().toString())
            .digest("hex");
          return redisClient.hset(
            "courseCodes",
            courseID,
            code,
            (err, reply2) => {
              redisClient.expire(`courseCodes`, SESSION_EXPIRE_TIME);
              return res.json(code);
            }
          );
        } else {
          return res.json(reply);
        }
      });
    });

    // return redisClient.exists("courseCodes", (err, num) => {
    //   if (num > 0) {
    //     return redisClient.get("courseCodes", (err, reply) => {

    //       if (err) return res.status(500).end("Redis client broke");

    //       courseCodes = JSON.parse(reply);
    //       console.log("courseCodes", courseCodes);

    //       // check if code already exists
    //       if ((code = courseCodes[courseID])) {
    //         console.log("COde already exists", courseID, code);
    //         return res.json(code);
    //       }

    //       // Not in redis, need to create a new course code
    //       db.checkCourse(courseID, (err, result) => {
    //         if (err) return res.status(422).end("Bad input");
    //         let code = crypto
    //           .createHash("md5")
    //           .update(req.body.courseID + Date.now().toString())
    //           .digest("hex");
    //         console.log(
    //           "Code didnt exist, setting new code for",
    //           courseID,
    //           code,
    //           "\n----------------------------------------------------------------"
    //         );
    //         redisClient.set(
    //           "courseCodes",
    //           JSON.stringify({ ...courseCodes, [courseID]: code })
    //         );
    //         return res.json(code);
    //       });
    //     });
    //   } else {

    //   }
    // })
  }
);

app.delete(
  "/api/deleteSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    console.log("request is");
    console.log(req.body);
    redisClient.hget(req.body.course, "startedBy", (err, id) => {
      if (!id) {
        return res.status(400).end("No session exists");
      }
      if (id == req.session.user.id) {
        return redisClient.del(
          `${req.body.course}SESSION`,
          req.body.course,
          (err, number) => {
            return res.json(`${number} session(s) deleted`);
          }
        );
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

app.post(
  "/api/addtocourse/",
  authenticated,
  [body("userID").escape(), body("courseID").escape()],
  (req, res, next) => {
    let userID = req.body.userID;
    let courseID = req.body.courseID;
    db.addToCourse(userID, courseID, (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).end(err.message);
      }
      return res.json("Successfully added user to course");
    });
  }
);

app.post(
  "/api/searchuser/",
  authenticated,
  [body("query").escape()],
  (req, res, next) => {
    let searchQuery = req.body.query;
    db.searchUser(searchQuery, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).end(err.message);
      }
      console.log(results);
      return res.json(results);
    });
  }
);

app.post(
  "/api/sendemail",
  authenticated,
  [body("recipient").escape()],
  (req, res, next) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ENTERHERE", // generated ethereal user
        pass: "ENTERHERE", // generated ethereal password
      },
    });

    let message = {
      from: "turtlebear41@gmail.com",
      to: "tapexov866@2go-mail.com",
      subject: "Join my course!",
      text: "Plaintext version of the message",
      html: "<p>OMEGALUL</p>",
    };

    transporter.sendMail(message, function (err, info) {
      if (err) return res.status(500).end("Internal Server Error");
      console.log(info);
      return res.json(info);
    });
  }
);

app.get("/api/classes", authenticated, (req, res, next) => {
  console.log(req.session.classes);
  return redisClient.mget(
    req.session.classes.map((course) => {
      return `${course}SESSION`;
    }),
    (err, sessions) => {
      console.log("ASOPDJASOIJ");
      console.log(sessions);
      return res.json(
        req.session.classes.map((val, index) => {
          return {
            course: val,
            exists: sessions[index] === "", // If sessions exists
          };
        })
      );
    }
  );
});

app.get("/api/users", authenticated, (req, res, next) => {
  let page = req.query.page || 0;
  db.getUsers(page, (err, results, fields) => {
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
          ret.push({ course: course, exists: true });
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
      redisClient.exists(req.body.course, (err, num) => {
        if (num > 0) {
          req.session.currSession = req.body.course;
          return res.json("OK");
        }
        return res.status(400).end("No Session Exists");
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
    let parsedMsg = JSON.parse(message);

    let ret;
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
      // redisClient.rpush(`${req.session.currSession}CHAT`, parsedMsg.message);
      return redisClient.hget(ws.course, "chat", (err, chat) => {
        if (err) return;
        let messages = JSON.parse(chat);
        messages.push(parsedMsg.message);
        return redisClient.hset(
          ws.course,
          "chat",
          JSON.stringify(messages),
          (err, reply) => {
            if (err) return;
            return sendClients(ws.course, parsedMsg.message, "CHAT");

            // return sendClients(ws.course, messages, req.session.user.role);
          }
        );
      });
    } else {
      return redisClient.hget(ws.course, "suggestions", (err, suggestions) => {
        if (err) return;
        let suggestionsList = JSON.parse(suggestions);
        console.log(suggestionsList);
        suggestionsList.forEach((suggestion) => {
          // Already suggested
          if (
            suggestion.message === parsedMsg.message &&
            suggestion.lineNum === parsedMsg.lineNum
          ) {
            return;
            // return sendClients(
            //   ws.course,
            //   suggestionsList,
            //   req.session.user.role
            // );
          }
        });

        let newSuggestion = {
          suggestion: parsedMsg.message,
          lineNum: parsedMsg.lineNum,
        };

        suggestionsList.push(newSuggestion);
        return redisClient.hset(
          ws.course,
          "suggestions",
          JSON.stringify(suggestionsList),
          (err, reply) => {
            if (err) return;
            return sendClients(ws.course, newSuggestion, "SUGGESTION");
          }
        );
      });
    }
    wss.clients.forEach((client) => {
      if (client.course === ws.course) {
        client.send(JSON.stringify(ret));
      }
    });
  });

  redisClient.hgetall(req.session.currSession, (err, res) => {
    console.log(res);
    console.log("HEHEH");
    console.log(typeof res);
    console.log("code");

    let code = res.code;
    console.log("suggestions");

    let suggestions = JSON.parse(res.suggestions);
    console.log("chat");

    let chat = JSON.parse(res.chat);

    // let { code, suggestions, chat } = res;
    console.log("SENDING");
    sendClients(ws.course, { code, suggestions, chat }, "INITIAL");
  });

  // redisClient.hget(req.session.currSession, "code", (err, res) => {
  //   if (err) {
  //     console.log(err);
  //     return ws.send("Error retrieving initial message");
  //   }
  //   console.log(res);
  //   let ret = {
  //     from: "TEACHING ASSISTANT",
  //     message: res,
  //   };
  //   return ws.send(JSON.stringify(ret));
  // });
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
      redisClient.exists(req.session.currSession, (err, num) => {
        if (num > 0) {
          return wss.handleUpgrade(req, socket, head, (ws) => {
            console.log("Emitting request");
            wss.emit("session", ws, req);
          });
        }
        return socket.destroy();
      });
    } else {
      return socket.destroy();
    }
  });
});

function getCourseIdFromCode(courseCode) {
  return new Promise(function (resolve, reject) {
    redisClient.hgetall("courseCodes", (err, courseCodes) => {
      if (err) reject();
      // let courseCodes = JSON.parse(reply);
      console.log("courseCodes", courseCodes);
      resolve(
        Object.keys(courseCodes).find((key) => courseCodes[key] === courseCode)
      );
    });
  });
}

server.listen(8080);
