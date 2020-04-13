let http = (function () {
  let codeListeners = [];
  let suggestionListeners = [];
  let pythonListeners = [];
  let chatListeners = [];

  let module = {};

  let exampleSocket;
  module.connect = (onopen, onerror) => {
    // Uncomment line 12 and comment line 13 to run on local development
    // exampleSocket = new WebSocket(`ws://${window.location.host}/api/session`);
    exampleSocket = new WebSocket(`wss://${window.location.host}/api/session`);

    exampleSocket.onopen = (e) => {
      onopen();
    };

    exampleSocket.onerror = function (error) {
      console.error(error);
      onerror();
    };

    exampleSocket.onmessage = function (e) {
      let res = JSON.parse(e.data);
      let from = res.from;
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
        let { code, suggestions, chat, output } = res.message;
        codeListeners.forEach((listener) => {
          listener(code);
        });
        if (output) {
          pythonListeners.forEach((listener) => {
            listener(output);
          });
        }
        suggestions.forEach((suggestion) => {
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
        // Suggestions
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

  module.close = () => {
    exampleSocket.close();
    codeListeners = [];
    suggestionListeners = [];
    pythonListeners = [];
    chatListeners = [];
  };

  return module;
})();

export default http;
