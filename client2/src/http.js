import axios from "axios";

let http = (function() {
  const codeListeners = [];
  const suggestionListeners = [];
  const pythonListeners = [];
  const chatListeners = [];

  let module = {};

  const base_url = process.env.REACT_APP_API_BASE_URL || "";

  let exampleSocket;

  module.connect = () => {
    exampleSocket = new WebSocket(
      process.env.REACT_APP_SOCKET_URL ||
        `wss://${window.location.host}/api/session`
    );

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
      let res = JSON.parse(e.data);
      let from = res.from;
      // console.log("onmessage");
      // console.log(from);
      // console.log(res.message);

      if (from === "TEACHING ASSISTANT" && res.type != "CHAT") {
        codeListeners.forEach(listener => {
          listener(res.message);
        });
      } else if (from === "PYTHON") {
        pythonListeners.forEach(listener => {
          listener(res.message);
        });
      } else if (res.type == "CHAT") {
        chatListeners.forEach(listener => {
          listener(res.message);
        });
      } else {
        console.log("DEFAULT SUGGESTIONS")
        suggestionListeners.forEach(listener => {
          listener(res.message);
        });
      }
    };
  };

  module.code_listener = listener => {
    codeListeners.push(listener);
  };

  module.suggestion_listener = listener => {
    suggestionListeners.push(listener);
  };

  module.python_listener = listener => {
    pythonListeners.push(listener);
  };

  module.chat_listener = listener => {
    chatListeners.push(listener);
  };

  module.send_message = (message, type) => {
    // console.log(JSON.stringify({message:message, type:type}));
    exampleSocket.send(JSON.stringify({message:message, type:type}));
  };

  module.getCourses = () => {
    return axios.get(`${base_url}/api/classes`).then(res => res.data);
  };

  module.getSessions = () => {
    return axios.get(`${base_url}/api/sessions`).then(res => res.data);
  };

  module.startSession = courseId => {
    return axios
      .post(`${base_url}/api/createSession`, {
        course: courseId
      })
      .then(res => res.data);
  };

  module.joinSession = courseId => {
    return axios
      .post(`${base_url}/api/connectSession`, { course: courseId })
      .then(res => res.data);
  };
  return module;
})();

export default http;
