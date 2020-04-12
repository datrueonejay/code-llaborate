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
      console.log(e);
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
      console.log(`message from ${from}`);
      if (from === "TEACHING ASSISTANT" && res.type !== "CHAT") {
        codeListeners.forEach((listener) => {
          listener(res.message);
        });
      } else if (from === "PYTHON") {
        pythonListeners.forEach((listener) => {
          listener(res.message);
        });
      } else if (from === "CHAT") {
        chatListeners.forEach((listener) => {
          listener(res.message);
        });
      } else if (from === "INITIAL") {
        // console.log(typeof res.message);
        // initialListeners.forEach((listener) => {
        //   listener(res.message);
        // });
        let { code, suggestions, chat } = res.message;
        console.log(code);
        console.log(typeof suggestions);
        console.log(chat);
        codeListeners.forEach((listener) => {
          listener(code);
        });
        suggestions.forEach((suggestion) => {
          console.log(suggestion);
          suggestionListeners.forEach((listener) => {
            listener(suggestion);
          });
        });
        chat.forEach((message) => {
          chatListeners.forEach((listener) => {
            listener(message);
          });
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
