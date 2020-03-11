let http = (function() {
  const axios = require("axios").default;
  const exampleSocket = new WebSocket("ws://localhost:3001");

  const listeners = [];

  exampleSocket.onopen = () => {
    console.log("connection and opened");
  };

  exampleSocket.onerror = function(error) {
    console.log("WebSocket Error " + error);
  };

  exampleSocket.onmessage = function(e) {
    console.log("Server: " + e.data);
    listeners.forEach(listener => {
      listener(e.data);
    });
  };

  let module = {};

  module.socket_listener = listener => {
    listeners.push(listener);
  };

  module.send_message = message => exampleSocket.send(message);
  return module;
})();

export default http;
