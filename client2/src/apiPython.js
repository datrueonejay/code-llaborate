"use strict";

// const serverurl = "http://localhost:3001";
const serverurl = process.env.REACT_APP_PYTHON_BASE_URL || "";

function sendFiles(method, url, data, callback) {
  url = serverurl + url;
  let formdata = new FormData();
  Object.keys(data).forEach(function(key) {
    let value = data[key];
    formdata.append(key, value);
  });
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status !== 200)
      callback("[" + xhr.status + "]" + xhr.responseText, null);
    else callback(null, JSON.parse(xhr.responseText));
  };
  xhr.open(method, url, true);
  xhr.send(formdata);
}

exports.compileText = function(code, callback = null) {
  sendFiles("POST", "/compile/plaintext/", { code: code }, callback);
};

exports.compileFile = function(file, callback = null) {
  sendFiles("POST", "/compile/file/", { file: file }, callback);
};
