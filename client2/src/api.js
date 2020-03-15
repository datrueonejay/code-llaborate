// import axios from "axios";

// "use strict";
const axios = require("axios");

// const dburl = "http://localhost:3006";
// const dburl = "http://localhost:8080";
const dburl = "";
// const dburl = "";

function send(method, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    console.log(document.cookie);
    if (xhr.status !== 200)
      callback("[" + xhr.status + "]" + xhr.responseText, null);
    else {
      callback(null, JSON.parse(xhr.responseText));
    }
  };
  url = dburl + url;
  xhr.open(method, url, true);
  // xhr.withCredentials = true;

  if (!data) xhr.send();
  else {
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  }
}

exports.addUser = function(username, password, role, name, callback = null) {
  // send("POST", "/db/adduser/", {username: username, password: password, role:role, name:name}, callback);
  send(
    "POST",
    "/api/signup/",
    { username: username, password: password, role: role, name: name },
    callback
  );
};

exports.checkUser = function(username, password, callback = null) {
  // send("POST", "/db/checkuser/", {username: username, password: password }, callback);
  send(
    "POST",
    "/api/login/",
    { username: username, password: password },
    callback
  );
  // axios
  //   .post(`${dburl}/api/login/`, { username: username, password: password })
  //   .then(res => {
  //     callback(null, res);
  //   })
  //   .catch(err => {
  //     callback(err, null);
  //   });
};
