const axios = require("axios");

// General api endpoints
exports.getUsers = (page = 0) => {
  return axios
    .get(`/api/users?page=${page}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.searchUser = (query) => {
  return axios
    .post("/api/searchuser", { query })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.getCourses = (page = 0) => {
  return axios
    .get(`/api/getallcourses?page=${page}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.getUserCourses = () => {
  return axios
    .get(`/api/classes`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.addToCourse = (userID, courseID) => {
  return axios
    .post("/api/addtocourse", { userID, courseID })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.createCourseCode = (courseID) => {
  return axios
    .post("/api/createcoursecode", { courseID })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.sendEmail = (recipient, message) => {
  return axios
    .post("/api/sendemail", { recipient, message })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};
// python endpoints
exports.executePython = (code) => {
  return axios
    .post(`/api/python`, { code: code })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

// Session endpoints
exports.getSessions = () => {
  return axios
    .get(`/api/sessions`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.joinSession = (courseId) => {
  return axios
    .post(`/api/connectSession`, { course: courseId })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.joinCourse = (courseCode) => {
  return axios
    .post("/api/joincourse", { courseCode })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.startSession = (courseId) => {
  return axios
    .post(`/api/createSession`, {
      course: courseId,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};

exports.stopSession = (courseId) => {
  return axios
    .delete(`/api/deleteSession`, {
      data: { course: courseId },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response);
      throw err.response.data || err.response.responseText;
    });
};
