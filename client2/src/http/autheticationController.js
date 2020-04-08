const axios = require("axios");

exports.signup = (username, password, role, name) => {
  return axios
    .post("/api/signup", {
      username: username,
      password: password,
      role: role,
      name: name,
    })
    .then((res) => res.data);
};

exports.login = (username, password) => {
  return axios
    .post("/api/login", { username: username, password: password })
    .then((res) => res.data);
};

exports.signout = () => {
  return axios.get("/api/signout").then((res) => res.data);
};
