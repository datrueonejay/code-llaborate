import React, { useEffect, useState } from 'react';
import "../css/InstructorView.css";
import "../App.css";

function InstructorView(props) {
  const api = require("../api.js");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);


  useEffect(() => {
    function updateStudents() {
      api.getStudents((err, res) => {setStudents(res)});
    }

    function updateCourses() {
      api.getCourses((err, res) => {setCourses(res)});
    }

    updateStudents();
    updateCourses();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    console.log(formData);
    let studentId = formData.get("studentID");
    let courseCode = formData.get("courseCode");

    api.addStudentToCourse(studentId, courseCode, (err, res) => {
      console.log(res);
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" id="studentID" name="studentID" placeholder="Student ID"></input>
        <input type="text" id="courseCode" name="courseCode" placeholder="Course code"></input>
        <input type="submit" value="Add student to course"></input>
      </form>

      <h1>Students:</h1>
      <ul>
        {students.map((student) => {
          return <li key={student.ID} id={student.ID}>{student.Name} id: {student.ID}</li>
        })}
      </ul>

      <h1>Courses:</h1>
      <ul>
      {courses.map((course, index) => {
          return <li key={index} id={course.ID}>{course.CourseCode}</li>
        })}
      </ul>
    </div>

  )
}

export default InstructorView;