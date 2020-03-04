let ws = (function() {
  const ws = new WebSocket("ws://localhost:3001/addmessage");

  const listeners = [];

  ws.onopen = () => {
    console.log("connection and opened")
  }

  ws.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  ws.onmessage = function (e) {
    console.log('Server: ' + JSON.parse(e.data));
    console.log(e.data);
    listeners.forEach(listener => {
      listener(JSON.parse(e.data));
    })
  };


  let module = {};


  module.socket_listener = (listener) => {
    listeners.push(listener);
  }

  module.send_message = (message) => ws.send(message);
  return module;
})();

export default ws;
