let crypto = require("crypto");
let fs = require("fs");
const spawn = require("child_process").spawn;

const pythonPath = process.env.PYTHON_PATH || "/usr/local/bin/python";

//////////////// Python Compiler Imports/Constants //////////////////
let mkdirp = require("mkdirp");
const path = require("path");

/////////////////////////////////////////////////////////////////
/**
 * credits: Code Snippets for making parent folder
 *  https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist
 * 
 * Python Spawn Code inspired by: 
 * https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js
 */
exports.executePython = (code, onOutput, onError, onExit) => {
  let filename = randomString();

  let codePath = `/tmp/${filename}.py`;
  let pypyInteractPath = path.join(__dirname, `/pypy/pypy/sandbox/pypy_interact.py`);
  let pypySandbox = path.join(__dirname, `/pypy/pypy/goal/pypy-c`);
  let filePath = path.join(__dirname, `/pypy/pypy/sandbox/tmp/${filename}.py`);


  let getDirName = path.dirname;
  // mks the parent dir if it doesn't exist
  mkdirp(getDirName(filePath))
    .then((made) => {
      fs.writeFile(filePath, code, { flag: "w" }, function (err) {
        if (err) throw err;

        let compileScript = spawn(pythonPath, [ pypyInteractPath, `--tmp=${getDirName(filePath)}`, "--timeout=3", pypySandbox, "-S",  codePath]);


        compileScript.stdout.on("data", (data) => {
          let string = byteToString(data);
          onOutput(string);
        });

        compileScript.stderr.on("data", (data) => {
          let string = byteToString(data);
          onError(string);
        });

        compileScript.on("exit", (code) => {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
          onExit(code);
        });
      });
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

//Credits: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
let randomString = () => {
  return crypto.randomBytes(20).toString("hex");
};

let byteToString = function (data) {
  return new TextDecoder("utf-8").decode(data);
};
