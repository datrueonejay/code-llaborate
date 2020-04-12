const axios = require("axios");

// General api endpoints
exports.getUsers = (page = 0) => {
  return axios.get(`/api/users?page=${page}`).then((res) => res.data);
};

exports.searchUser = (query) => {
  return axios.post("/api/searchuser", { query }).then((res) => res.data);
};

exports.getCourses = (page = 0) => {
  return axios.get(`/api/getallcourses?page=${page}`).then((res) => res.data);
};

exports.getUserCourses = () => {
  return axios.get(`/api/classes`).then((res) => res.data);
};

exports.addToCourse = (userID, courseID) => {
  return axios
    .post("/api/addtocourse", { userID, courseID })
    .then((res) => res.data);
};

exports.createCourseCode = (courseID) => {
  return axios
    .post("/api/createcoursecode", { courseID })
    .then((res) => res.data);
}

exports.sendEmail = (recipient, message) => {
  return axios
    .post("/api/sendemail", { recipient, message })
    .then((res) => res.data);
}
// python endpoints
exports.executePython = (code) => {
  return axios.post(`/api/python`, { code: code }).then((res) => res.data);
};

// Session endpoints
exports.getSessions = () => {
  return axios.get(`/api/sessions`).then((res) => res.data);
};

exports.joinSession = (courseId) => {
  return axios
    .post(`/api/connectSession`, { course: courseId })
    .then((res) => res.data);
};

exports.joinCourse = (courseCode) => {
  return axios
    .post('/api/joincourse', {courseCode})
    .then((res) => res.data);
}

exports.startSession = (courseId) => {
  return axios
    .post(`/api/createSession`, {
      course: courseId,
    })
    .then((res) => res.data);
};

exports.stopSession = (courseId) => {
  console.log(courseId);
  return axios
    .delete(`/api/deleteSession`, {
      data: { course: courseId },
    })
    .then((res) => res.data);
};
