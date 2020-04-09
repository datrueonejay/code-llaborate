const axios = require("axios");

// General api endpoints
exports.getStudents = (page = 0) => {
  return axios.get(`/api/students?page=${page}`).then((res) => res.data);
};

exports.searchStudent = (query) => {
  return axios.post("/api/searchstudent", { query }).then((res) => res.data);
};

exports.getCourses = () => {
  return axios.get("/api/getallcourses").then((res) => res.data);
};

exports.getUserCourses = () => {
  return axios.get(`/api/classes`).then((res) => res.data);
};

exports.addStudentToCourse = (studentID, courseID) => {
  return axios
    .post("/api/addstudenttocourse", { studentID, courseID })
    .then((res) => res.data);
};

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
