let http = (function() {
  const axios = require("axios").default;
  const exampleSocket = new WebSocket("ws://localhost:3001");
  let module = {};

  module.get = axios
    .get("http://localhost:3001")
    .then(function(response) {
      // handle success
      console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });

  module.socket = () => exampleSocket.send("Request from client");

  return module;
})();

export default http;
