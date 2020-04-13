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
const path = require("path");

// Redis Connect
const RedisStore = require("connect-redis")(session);

//Swagger documentation
const swaggerUi = require("swagger-ui-express");
const apiDocs = require("./docs.json");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static("build"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body, req.query);
  next();
});

const sessionParser = session({
  secret: process.env.SESSION_SECRET || "d3f4ults3cr3t",
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redisClient }),
  cookie: { httpOnly: true, secure: true, sameSite: true },
});

app.use(sessionParser);

let authenticated = (req, res, next) => {
  if (!req.session.user) return res.status(401).end("Access denied");
  next();
};

let inSession = (req, res, next) => {
  if (!req.session.currSession)
    return res.status(403).end("Not currently in a session.");
  next();
};

let isInstructor = (req, res, next) => {
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

    if (!username || !password || !role || !name || role === "INSTRUCTOR") {
      return res.status(400).end("Bad request");
    }
    return db.addUser(role, username, password, name, (err, user) => {
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
        return res.status(401).end(err);
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
    if (!courseCode) {
      return res.status(400).end("Bad Request");
    }
    return getCourseIdFromCode(courseCode)
      .then((courseID) => {
        userID = req.session.user.id;
        return db.checkCourse(courseID, (err, results) => {
          if (err) return res.status(500).end(err);

          // if course found
          if (results.length > 0) {
            return db.addToCourse(userID, courseID, (err, results) => {
              if (err) {
                return res.status(500).end(err);
              }

              return db.findClasses(
                req.session.user.username,
                (err, classes) => {
                  if (err) {
                    return res.status(500).end(err);
                  }
                  req.session.classes = classes;
                  return res.json(classes);
                }
              );
            });
          } else {
            return res.status(400).end("Course Does Not Exist");
          }
        });
      })
      .catch((err) => {
        return res.status(400).end("Course Code Does Not Exist");
      });
  }
);

// Course and sessions logic
app.post(
  "/api/createSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    return db.isStudent(req.session.user.username, (err, isStudent) => {
      if (err) return res.status(500).end(err);
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
              return redisClient.set(
                `${req.body.course}SESSION`,
                "",
                (err, reply) => {
                  if (err) {
                    return res.status(500).end("Internal Server Error");
                  }
                  redisClient.expire(
                    `${req.body.course}SESSION`,
                    SESSION_EXPIRE_TIME
                  );

                  return redisClient.hmset(
                    req.body.course,
                    "code",
                    "",
                    "startedBy",
                    req.session.user.id,
                    "suggestions",
                    JSON.stringify([]),
                    "chat",
                    JSON.stringify([]),
                    "output",
                    "",
                    (err, reply) => {
                      if (err) {
                        return res.status(500).end("Internal Server Error");
                      }
                      redisClient.expire(req.body.course, SESSION_EXPIRE_TIME);
                      return res.json("Session Created");
                    }
                  );
                }
              );
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
    if (!courseID) {
      return res.status(400).end("Bad Request");
    }
    // Check if the hash with course code key exists

    // logic to get random hash from https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
    return db.checkCourse(courseID, (err, result) => {
      if (err) return res.status(422).end("Bad input");
      if (result.length > 0) {
        return redisClient.hget("courseCodes", courseID, (err, reply) => {
          if (err) return res.status(500).end(err);
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
      } else {
        return res.status(422).end("Bad input");
      }
    });
  }
);

app.delete(
  "/api/deleteSession",
  authenticated,
  inSession,
  [body("course").escape()],
  (req, res, next) => {
    return redisClient.hget(req.body.course, "startedBy", (err, id) => {
      if (err) return res.status(500).end("Internal Server Error");
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
  }
);

app.post(
  "/api/addtocourse/",
  authenticated,
  [body("userID").escape(), body("courseID").escape()],
  (req, res, next) => {
    let userID = req.body.userID;
    let courseID = req.body.courseID;
    if (!userID || !courseID) {
      return res.status(400).end("Bad Request");
    }
    return db.addToCourse(userID, courseID, (err, results) => {
      if (err) {
        return res.status(500).end(err);
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
    if (!searchQuery) {
      return res.status(400).end("Bad Request");
    }
    db.searchUser(searchQuery, (err, results) => {
      if (err) {
        return res.status(500).end(err.message);
      }
      return res.json(results);
    });
  }
);

app.post(
  "/api/sendemail",
  authenticated,
  [body("recipient").escape(), body("message").escape()],
  (req, res, next) => {
    let recipient = req.body.recipient;

    if (!recipient) {
      return res.status(400).end("Bad Request");
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    let message = {
      from: process.env.NODEMAILER_EMAIL,
      to: recipient,
      subject: "Join my course!",
      text: "Join my course using my code!",
      html: `<p>${req.body.message}</p>`,
    };

    return transporter.sendMail(message, function (err, info) {
      if (err) return res.status(500).end("Internal Server Error");
      return res.json(info);
    });
  }
);

app.get("/api/classes", authenticated, (req, res, next) => {
  return redisClient.mget(
    req.session.classes.map((course) => {
      return `${course}SESSION`;
    }),
    (err, sessions) => {
      if (err) return res.status(500).end("Internal Server Error");
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
  return db.getUsers(page, (err, results, fields) => {
    if (err) {
      return res.status(500).end(err);
    }
    return res.json(results);
  });
});

app.get("/api/getallcourses", authenticated, (req, res, next) => {
  let page = req.query.page || 0;
  db.getCourses(page, (err, results, fields) => {
    if (err) return res.status(500).end(err);
    return res.json(results);
  });
});

app.get("/api/sessions", authenticated, (req, res, next) => {
  if (req.session.classes.length === 0) {
    return res.json([]);
  }
  return redisClient.mget(
    req.session.classes.map((val) => {
      return `${val}SESSION`;
    }),
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).end("Internal Server error");
      }
      let ret = [];
      req.session.classes.forEach((course, index) => {
        if (results[index] !== null) {
          ret.push({ course: course, exists: true });
        }
      });
      return res.json(ret);
    }
  );
});

app.post(
  "/api/connectSession",
  authenticated,
  [body("course").escape()],
  (req, res, next) => {
    if (!req.body.course) {
      return res.status(400).end("Bad Request");
    }
    if (req.session.classes.includes(parseInt(req.body.course))) {
      return redisClient.exists(req.body.course, (err, num) => {
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
      return redisClient.hget(
        req.session.currSession,
        "output",
        (err, oldOutput) => {
          if (err) return res.status(500).end("internal Server Error");
          return redisClient.hset(
            req.session.currSession,
            "output",
            oldOutput + output,
            (err, reply) => {
              if (err) return res.status(500).end("internal Server Error");
              return sendClients(req.session.currSession, output, from);
            }
          );
        }
      );
    },
    (errOutput) => {
      return redisClient.hget(
        req.session.currSession,
        "output",
        (err, oldOutput) => {
          if (err) return res.status(500).end("internal Server Error");
          return redisClient.hset(
            req.session.currSession,
            "output",
            oldOutput + errOutput,
            (err, reply) => {
              if (err) return res.status(500).end("internal Server Error");
              return sendClients(req.session.currSession, errOutput, from);
            }
          );
        }
      );
    },
    (exitCode) => {
      return res.json("Finished");
    }
  );
});

// Send to all clients including yourself
let sendClients = (course, data, from) => {
  let ret = {
    from: from,
    message: data,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.course === course) {
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

// When someone successfully connects to websocket
wss.on("session", (ws, req) => {
  ws.course = req.session.currSession;

  ws.isAlive = true;
  ws.on("pong", heartbeat);

  ws.on("message", (message) => {
    let parsedMsg = JSON.parse(message);
    let ret;
    // TA CODE
    if (
      req.session.user.role === "TEACHING ASSISTANT" &&
      parsedMsg.type == "CODE"
    ) {
      let code = parsedMsg.message;
      redisClient.hset(ws.course, "code", code);
      ret = {
        type: "CODE",
        from: req.session.user.role,
        message: code,
      };
      return wss.clients.forEach((client) => {
        if (client.course === ws.course && ws !== client) {
          client.send(JSON.stringify(ret));
        }
      });
    } else if (parsedMsg.type == "CHAT") {
      return redisClient.hget(ws.course, "chat", (err, chat) => {
        if (err) return;
        let messages = JSON.parse(chat);
        let message = parsedMsg.message;
        let data = {
          message: message,
          time: new Date().toUTCString(),
          user: req.session.user.name,
        };
        messages.push(data);
        return redisClient.hset(
          ws.course,
          "chat",
          JSON.stringify(messages),
          (err, reply) => {
            if (err) return;
            return sendClients(ws.course, data, "CHAT");
          }
        );
      });
    } else {
      return redisClient.hget(ws.course, "suggestions", (err, suggestions) => {
        if (err) return;
        let suggestionsList = JSON.parse(suggestions);
        let suggestion = parsedMsg.message;
        let lineNum = parsedMsg.lineNum;
        for (let i = 0; i < suggestionsList.length; i++) {
          // Already suggested
          if (
            suggestionsList[i].suggestion === suggestion &&
            suggestionsList[i].lineNum === lineNum
          ) {
            return;
          }
        }
        let newSuggestion = {
          suggestion: suggestion,
          lineNum: lineNum,
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
  });

  // Send initial data about session
  redisClient.hgetall(req.session.currSession, (err, res) => {
    let code = res.code;
    let output = res.output;
    let suggestions = JSON.parse(res.suggestions);
    let chat = JSON.parse(res.chat);

    ws.send(
      JSON.stringify({
        from: "INITIAL",
        message: { code, suggestions, chat, output },
      })
    );
  });
});

// Verify clients are still connected, taken from https://github.com/websockets/ws
function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wss.on("close", function close() {
  clearInterval(interval);
});

server.on("upgrade", (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
  // Necessary because we only set express app to use parser, not the http server
  sessionParser(req, {}, () => {
    if (!req.session.user) {
      return socket.destroy();
    }
    if (pathname === "/api/session") {
      return redisClient.exists(req.session.currSession, (err, num) => {
        if (err) return socket.destroy();
        if (num > 0) {
          return wss.handleUpgrade(req, socket, head, (ws) => {
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
    return redisClient.hgetall("courseCodes", (err, courseCodes) => {
      if (err || !courseCodes) return reject();
      return resolve(
        Object.keys(courseCodes).find((key) => courseCodes[key] === courseCode)
      );
    });
  });
}

// keep at bottom so other routes still work - Ricky
// snippet from https://tylermcginnis.com/react-router-cannot-get-url-refresh/
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build/index.html"), function (err) {
    if (err) {
      res.status(500).end("Internal Server Error");
    }
  });
});

server.listen(8080);
