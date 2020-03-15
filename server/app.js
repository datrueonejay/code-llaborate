let express = require("express");
let app = express();
let expressWs = require("express-ws")(app);
let redis = require("redis");
//////////////// Python Compiler Imports/Constants //////////////////
let mkdirp = require('mkdirp');


const client = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST || "localhost"
);

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');
const multer  = require('multer');
const uniquefilename = require('unique-filename');
const upload = multer({ dest: path.join(__dirname, 'uploads')});

/////////////////////////////////////////////////////////////////

messages = [];
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res, next) {
  console.log("GET ROUTE");
  return res.send("Get route");
});

app.ws("/", function(ws, req) {
  ws.on("message", function(msg) {
    console.log("SOCKET MESSAGE");
    client.set("doc", msg);
    expressWs.getWss().clients.forEach(client => {
      console.log(msg);
      client.send(msg);
    });
  });
  //TODO: Fix this to connection and repush to dockerhub
  ws.on("connection", function(ws) {
    console.log("Trying to connect");
    ws.send("AOSIJDOASIDJ");
    client.get("doc", (err, res) => {
      if (err) {
        ws.send(`Error: ${err}`);
      } else {
        ws.send(res);
      }
    });
  });
});

app.ws("/addmessage", function(ws, req) {
  ws.on("message", function(msg) {
    console.log("Received message from client", msg);
    let message = {
      content: `${msg}`
    };
    messages.push(message);
    console.log("Updated messages", messages, typeof messages);
    expressWs.getWss().clients.forEach(client => {
      client.send(JSON.stringify(messages));
    });
  });
});

//////////////// Python Compiler //////////////////
/**
 * credits: https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist
 */

// upload.sing('file') file variable corresponds to req
app.post('/compile/file/', upload.single('file'), function (req, res, next) {
  let fs = require('fs');
  // console.log("this is file");
  
  let file = req.file;
  // console.log(file.path);

  let filePath = file.path;

  compilePython(filePath, function(output){
    // console.log("this comes back");
    // console.log("this is output "+ output);
    res.json({path: filePath, string: output});
  });

});


app.post('/compile/plaintext/', upload.single('picture'), function (req, res, next) {
  let fs = require('fs');
  // console.log("this is plain");
  // console.log(req.body);
  let string = req.body.code;
  // console.log("hello");
  // console.log(string);
  // console.log("bye");
  let tempfile = uniquefilename("/tmp");
  // full path to tmp file
  let filePath = path.join(__dirname, tempfile);
  //function to get the parent dir of tmp file
  let getDirName = path.dirname;
  // mks the parent dir if it doesn't exist
  mkdirp(getDirName(filePath), function (err) {
    if (err) throw err;
    fs.writeFile(filePath, string, { flag: 'w' }, function (err) {
      if (err) throw err;
      console.log('Saved!');
      compilePython(filePath, function(output){
      // console.log("this comes back");
      // console.log("this is output "+ output);
      res.json({path: filePath, string: output});
      });
    });
  });
});


// Function to convert an Uint8Array to a string
var decoduint8array = function(data){
  return (new TextDecoder("utf-8").decode(data));
};

function compilePython(path, callback){
  let output = "";
  let pythonPath = "/usr/local/bin/python";

  const spawn = require('child_process').spawn;

  const compilescript = spawn(pythonPath, [path]);

  //output
  compilescript.stdout.on('data', (data) => {
      output = output + decoduint8array(data);
      // console.log(decoduint8array(data));
  });

  // error 
  compilescript.stderr.on('data', (data) => {
      output = output + decoduint8array(data);
      // console.log(decoduint8array(data));
  });
  
  // exit
  compilescript.on('exit', (code) => {
      console.log("Exit code : " + code);
      console.log(output);
      // console.log("this is the string output;");
      callback(output);
      //return output;
  });


}

/////////////////////////////////////////////////////////////////

app.listen(3001, err => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:3001");
});
