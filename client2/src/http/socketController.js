import axios from "axios";

let http = (function () {
  const codeListeners = [];
  const suggestionListeners = [];
  const pythonListeners = [];
  const chatListeners = [];

  let module = {};

  let exampleSocket;
  module.connect = (onopen, onerror) => {
    exampleSocket = new WebSocket(
      process.env.REACT_APP_SOCKET_URL ||
        `wss://${window.location.host}/api/session`
    );

    exampleSocket.onopen = (e) => {
      console.log("connection and opened");
      console.log("Server: " + e.data);
      onopen();
    };

    exampleSocket.onerror = function (error) {
      console.log("WebSocket Error ");
      console.log(error);
      onerror();
    };

    exampleSocket.onmessage = function (e) {
      console.log("Server: " + e.data);
      let res = JSON.parse(e.data);
      let from = res.from;
      if (from === "TEACHING ASSISTANT" && res.type != "CHAT") {
        codeListeners.forEach((listener) => {
          listener(res.message);
        });
      } else if (from === "PYTHON") {
        pythonListeners.forEach((listener) => {
          listener(res.message);
        });
      } else if (res.type == "CHAT") {
        chatListeners.forEach((listener) => {
          listener(res.message);
        });
      } else {
        console.log("DEFAULT SUGGESTIONS");
        console.log(res.message);
        suggestionListeners.forEach((listener) => {
          listener(res.message);
        });
      }
    };
  };

  module.code_listener = (listener) => {
    codeListeners.push(listener);
  };

  module.suggestion_listener = (listener) => {
    suggestionListeners.push(listener);
  };

  module.python_listener = (listener) => {
    pythonListeners.push(listener);
  };

  module.chat_listener = (listener) => {
    chatListeners.push(listener);
  };

  module.send_code = (message) => {
    exampleSocket.send(JSON.stringify({ message: message, type: "CODE" }));
  };

  module.send_chat = (chat) => {
    exampleSocket.send(JSON.stringify({ message: chat, type: "CHAT" }));
  };

  module.send_suggestion = (lineNum, message) => {
    exampleSocket.send(
      JSON.stringify({ message: message, type: "SUGGESTION", lineNum: lineNum })
    );
  };

  return module;
})();

export default http;
