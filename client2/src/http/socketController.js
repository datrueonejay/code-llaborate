class SocketConnection {
  onmessage = (e) => {
    let res = JSON.parse(e.data);
    let from = res.from;
    if (from === "TEACHING ASSISTANT" && res.type !== "CHAT") {
      this.codeListeners.forEach((listener) => {
        listener(res.message);
      });
    } else if (from === "PYTHON") {
      this.pythonListeners.forEach((listener) => {
        listener(res.message);
      });
    } else if (from === "CHAT") {
      this.chatListeners.forEach((listener) => {
        listener(res.message);
      });
    } else if (from === "INITIAL") {
      let { code, suggestions, chat, output } = res.message;
      this.codeListeners.forEach((listener) => {
        listener(code);
      });
      if (output) {
        this.pythonListeners.forEach((listener) => {
          listener(output);
        });
      }
      suggestions.forEach((suggestion) => {
        this.suggestionListeners.forEach((listener) => {
          listener(suggestion);
        });
      });
      chat.forEach((message) => {
        this.chatListeners.forEach((listener) => {
          listener(message);
        });
      });
    } else {
      // Suggestions
      this.suggestionListeners.forEach((listener) => {
        listener(res.message);
      });
    }
  };

  constructor(onopen, onerror) {
    this.codeListeners = [];
    this.suggestionListeners = [];
    this.pythonListeners = [];
    this.chatListeners = [];
    this.socket = new WebSocket(
      process.env.REACT_APP_SOCKET_URL ||
        `wss://${window.location.host}/api/session`
    );

    this.socket.onopen = (e) => {
      onopen();
    };

    this.socket.onerror = function (error) {
      console.error(error);
      onerror();
    };

    this.socket.onmessage = this.onmessage;
  }

  code_listener = (listener) => {
    this.codeListeners.push(listener);
  };

  suggestion_listener = (listener) => {
    this.suggestionListeners.push(listener);
  };

  python_listener = (listener) => {
    this.pythonListeners.push(listener);
  };

  chat_listener = (listener) => {
    console.log(this.chatListeners);
    this.chatListeners.push(listener);
  };

  send_code = (message) => {
    this.socket.send(JSON.stringify({ message: message, type: "CODE" }));
  };

  send_chat = (chat) => {
    this.socket.send(JSON.stringify({ message: chat, type: "CHAT" }));
  };

  send_suggestion = (lineNum, message) => {
    this.socket.send(
      JSON.stringify({
        message: message,
        type: "SUGGESTION",
        lineNum: lineNum,
      })
    );
  };
}
export default SocketConnection;
