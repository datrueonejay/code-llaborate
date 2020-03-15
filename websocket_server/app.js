// Redis Init
const redis = require("redis");
const redisClient = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || "localhost"
);

// DB api init
const db = require("./database");

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

app.use(function(req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

const sessionParser = session({
  secret: process.env.SESSION_SECRET || "d3f4ults3cr3t",
  resave: false,
  saveUninitialized: true
  // cookie: { httpOnly: true, secure: true, sameSite: true }
});

app.use(sessionParser);

let authenticated = (req, res, next) => {
  // console.log(req.session);
  if (!req.session.user) return res.status(401).end("Access denied");
  next();
};

// Health Check
app.get("/health", (req, res) => {
  return res.status(200).end("OK");
});

//////////////// Python Compiler Imports/Constants //////////////////
let mkdirp = require("mkdirp");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "uploads") });

/////////////////////////////////////////////////////////////////

// Web socket authentication based off of https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js

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
      if (err) return res.status(500).end(err);
      req.session.user = user;
      req.session.classes = [];
      req.session.currSession = null;
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
      if (err) return res.status(500).end(err);
      db.findClasses(user.username, (err, classes) => {
        if (err) return res.status(500).end(err);
        req.session.user = user;
        req.session.classes = classes;
        req.session.currSession = null;
        return res.json(user);
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
      if (err) return res.status(500).end(err);
      // Not a student
      if (!isStudent) {
        // Valid instructor
        if (req.session.classes.includes(parseInt(req.body.course))) {
          req.session.currSession = req.body.course;
          redisClient.set(req.body.course, "");
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

app.get("/api/classes", authenticated, (req, res, next) => {
  console.log(req.session.classes);
  res.json(req.session.classes);
});

app.get("/api/sessions", authenticated, (req, res, next) => {
  // console.log(req.session.classes);
  redisClient.mget(req.session.classes, (err, results) => {
    console.log(err);
    if (err) return res.status(500).end("Internal Server error");

    // console.log("results");
    // console.log(results);

    let ret = [];
    req.session.classes.forEach((course, index) => {
      // console.log(res)
      if (results[index] !== null) {
        ret.push(course);
      }
    });

    return res.json(ret);
  });
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

//////////////// Python Compiler //////////////////
/**
 * credits: https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist
 */

// upload.sing('file') file variable corresponds to req
app.post("/compile/file/", upload.single("file"), function(req, res, next) {
  let fs = require("fs");
  // console.log("this is file");

  let file = req.file;
  // console.log(file.path);

  let filePath = file.path;

  compilePython(filePath, function(output) {
    // console.log("this comes back");
    // console.log("this is output "+ output);
    res.json({ path: filePath, string: output });
  });
});

app.post("/compile/plaintext/", upload.single("picture"), function(
  req,
  res,
  next
) {
  let fs = require("fs");
  // console.log("this is plain");
  // console.log(req.body);
  let string = req.body.code;
  // console.log("hello");
  // console.log(string);
  // console.log("bye");

  // full path to tmp file
  let filePath = path.join(__dirname, "/tmp/code.txt");
  //function to get the parent dir of tmp file
  let getDirName = path.dirname;
  // mks the parent dir if it doesn't exist
  mkdirp(getDirName(filePath), function(err) {
    if (err) throw err;
    fs.writeFile(filePath, string, { flag: "w" }, function(err) {
      if (err) throw err;
      console.log("Saved!");
      compilePython(filePath, function(output) {
        // console.log("this comes back");
        // console.log("this is output "+ output);
        res.json({ path: filePath, string: output });
      });
    });
  });
});

// Function to convert an Uint8Array to a string
var decoduint8array = function(data) {
  return new TextDecoder("utf-8").decode(data);
};

function compilePython(path, callback) {
  let output = "";
  let pythonPath = process.env.PYTHON_PATH || "/usr/local/bin/python";

  const spawn = require("child_process").spawn;

  const compilescript = spawn(pythonPath, [path]);

  //output
  compilescript.stdout.on("data", data => {
    output = output + decoduint8array(data);
    // console.log(decoduint8array(data));
  });

  // error
  compilescript.stderr.on("data", data => {
    output = output + decoduint8array(data);
    // console.log(decoduint8array(data));
  });

  // exit
  compilescript.on("exit", code => {
    console.log("Exit code : " + code);
    console.log(output);
    // console.log("this is the string output;");
    callback(output);
    //return output;
  });
}

/////////////////////////////////////////////////////////////////

// Websocket init
const WebSocket = require("ws");
const url = require("url");
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, req) => {
  ws.course = req.session.currSession;

  ws.on("message", message => {
    console.log(`Got the message ${message}`);
    redisClient.set(ws.course, message);
    wss.clients.forEach(client => {
      if (client.course === ws.course) {
        client.send(message);
      }
    });
  });

  redisClient.get(req.session.currSession, (err, res) => {
    if (err) {
      console.log(err);
      return ws.send("Error retrieving initial message");
    }
    console.log(res);
    return ws.send(res);
  });
});

server.on("upgrade", (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
  // Necessary because we only set express app to use parser, not the http server
  sessionParser(req, {}, () => {
    if (!req.session.user) {
      return socket.destroy();
    }
    if (pathname === "/") {
      console.log("YEEE");
      console.log(req.session.currSession);
      redisClient.get(req.session.currSession, (err, res) => {
        console.log(err);
        console.log(res);
        if (res !== null) {
          return wss.handleUpgrade(req, socket, head, ws => {
            console.log("Emitting request");
            wss.emit("connection", ws, req);
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
