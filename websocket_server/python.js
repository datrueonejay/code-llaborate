let crypto = require("crypto");
let fs = require("fs");
const spawn = require("child_process").spawn;

const pythonPath = process.env.PYTHON_PATH || "/usr/local/bin/python";

//////////////// Python Compiler Imports/Constants //////////////////
let mkdirp = require("mkdirp");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "uploads") });

/////////////////////////////////////////////////////////////////
/**
 * credits: https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist
 */
exports.executePython = (code, onOutput, onError, onExit) => {
  let filename = randomString();

  // python /usr/src/app/pypy/pypy/sandbox/pypy_interact.py --tmp=/usr/src/app/pypy/pypy/sandbox/tmp --timeout=3 /usr/src/app/pypy/pypy/goal/pypy-c -S /tmp/test.py
  let tmpPath = path.join(__dirname, `/pypy/pypy/sandbox/tmp`);
  let codePath = `/tmp/${filename}.py`;
  let pypyInteractPath = path.join(__dirname, `/pypy/pypy/sandbox/pypy_interact.py`);
  let pypySandbox = path.join(__dirname, `/pypy/pypy/goal/pypy-c`);
  //let filePath = path.join(__dirname, `/tmp/${filename}.py`);

  let getDirName = path.dirname;

  // mks the parent dir if it doesn't exist
  mkdirp(getDirName(filePath), function (err) {
    if (err) throw err;
    fs.writeFile(filePath, code, { flag: "w" }, function (err) {
      if (err) throw err;
      // Execute python code
      // TODO: Replace with pypy sandbox
      //TODO: timeout
      //let compileScript = spawn(pythonPath, [filePath]);
      let compileScript = spawn(pythonPath, [ pypyInteractPath, `--tmp=${tmpPath}`, "--timeout=3", pypySandbox, "-S",  codePath]);

      compileScript.stdout.on("data", (data) => {
        let string = byteToString(data);
        onOutput(string);
      });

      compileScript.stderr.on("data", (data) => {
        let string = byteToString(data);
        onError(string);
      });

      compileScript.on("exit", (code) => {
        console.log("Exit code: " + code);
        onExit(code);
      });
    });
  });
};

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
let randomString = () => {
  return crypto.randomBytes(20).toString("hex");
};

let byteToString = function (data) {
  return new TextDecoder("utf-8").decode(data);
};

// Previous Stuff

//////////////// Python Compiler Imports/Constants //////////////////
// let mkdirp = require("mkdirp");
// const path = require("path");
// const multer = require("multer");
// const upload = multer({ dest: path.join(__dirname, "uploads") });

/////////////////////////////////////////////////////////////////
//////////////// Python Compiler //////////////////
/**
 * credits: https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist
 */

// upload.sing('file') file variable corresponds to req
// app.post("/compile/file/", upload.single("file"), function (req, res, next) {
//   let fs = require("fs");
//   // console.log("this is file");

//   let file = req.file;
//   // console.log(file.path);

//   let filePath = file.path;

//   compilePython(
//     filePath,
//     function (output) {
//       // console.log("this comes back");
//       // console.log("this is output "+ output);
//       res.json({ path: filePath, string: output });
//     },
//     req.session.currSession
//   );
// });

// app.post("/compile/plaintext/", upload.single("picture"), function (
//   req,
//   res,
//   next
// ) {
//   let fs = require("fs");
//   // console.log("this is plain");
//   // console.log(req.body);
//   let string = req.body.code;
//   // console.log("hello");
//   // console.log(string);
//   // console.log("bye");

//   // full path to tmp file
//   let filePath = path.join(__dirname, "/tmp/code.txt");
//   //function to get the parent dir of tmp file
//   let getDirName = path.dirname;
//   // mks the parent dir if it doesn't exist
//   mkdirp(getDirName(filePath), function (err) {
//     if (err) throw err;
//     fs.writeFile(filePath, string, { flag: "w" }, function (err) {
//       if (err) throw err;
//       console.log("Saved!");
//       compilePython(
//         filePath,
//         function (output) {
//           // console.log("this comes back");
//           // console.log("this is output "+ output);
//           res.json({ path: filePath, string: output });
//         },
//         req.session.currSession
//       );
//     });
//   });
// });

// // Function to convert an Uint8Array to a string
// var decoduint8array = function (data) {
//   return new TextDecoder("utf-8").decode(data);
// };

// function compilePython(path, callback, course) {
//   let output = "";
//   let pythonPath = process.env.PYTHON_PATH || "/usr/local/bin/python";

//   const spawn = require("child_process").spawn;

//   const compilescript = spawn(pythonPath, [path]);

//   //output
//   compilescript.stdout.on("data", (data) => {
//     // TODO: STREAM OUTPUT
//     let ret = {
//       from: "PYTHON",
//       message: decoduint8array(data),
//     };
//     wss.clients.forEach((client) => {
//       if (client.course === course) {
//         client.send(JSON.stringify(ret));
//       }
//     });
//     output = output + decoduint8array(data);
//     // console.log(decoduint8array(data));
//   });

//   // error
//   compilescript.stderr.on("data", (data) => {
//     let ret = {
//       from: "PYTHON",
//       message: decoduint8array(data),
//     };
//     wss.clients.forEach((client) => {
//       if (client.course === course) {
//         client.send(JSON.stringify(ret));
//       }
//     });
//     output = output + decoduint8array(data);
//     // console.log(decoduint8array(data));
//   });

//   // exit
//   compilescript.on("exit", (code) => {
//     console.log("Exit code : " + code);
//     console.log(output);
//     // console.log("this is the string output;");
//     callback(output);
//     //return output;
//   });
// }

// /////////////////////////////////////////////////////////////////
