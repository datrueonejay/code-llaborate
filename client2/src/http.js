let http = (function() {
  const exampleSocket = new WebSocket(
    process.env.REACT_APP_SOCKET_URL || "ws://localhost:8080"
  );
  // const exampleSocket = new WebSocket("ws://server:3001");

  const listeners = [];

  exampleSocket.onopen = e => {
    console.log("connection and opened");
    console.log("Server: " + e.data);
  };

  exampleSocket.onerror = function(error) {
    console.log("WebSocket Error ");
    console.log(error);
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
