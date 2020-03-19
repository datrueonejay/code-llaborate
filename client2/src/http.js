import axios from "axios";

let http = (function() {
  const listeners = [];
  let module = {};

  const base_url = process.env.REACT_APP_API_BASE_URL || "";

  let exampleSocket;

  module.connect = () => {
    exampleSocket = new WebSocket(
      process.env.REACT_APP_SOCKET_URL || "ws://localhost:8080"
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
      listeners.forEach(listener => {
        listener(e.data);
      });
    };
  };

  module.socket_listener = listener => {
    listeners.push(listener);
  };

  module.send_message = message => exampleSocket.send(message);

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
