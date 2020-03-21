import React, { useEffect, useState, useRef } from 'react';
import "../App.css";
import "../css/Form.css";
import "../css/List.css";

function InstructorView(props) {
  const api = require("../api.js");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const formRef = useRef(null);
  const studentIdRef = useRef(null);
  const courseIdRef = useRef(null);

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
    let studentID = formData.get("studentID");
    let courseID = formData.get("courseID");

    api.addStudentToCourse(studentID, courseID, (err, res) => {
      if (err) {
        console.log(err);
        setNotification("Student is already in the course or IDs do not exist");
      } else {
        setNotification("Successfully added student to the course");
      }
      formRef.current.reset();
    })
  }

  function setValue(ref, id) {
    return function(e) {
      console.log(ref, ref);
      ref.current.value = id;
    }
  }

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <h1 className="text-center">Add student to course</h1>
        <input ref={studentIdRef} type="text" id="studentID" name="studentID" placeholder="Student ID"></input>
        <input ref={courseIdRef} type="text" id="courseID" name="courseID" placeholder="Course ID"></input>
        <input type="submit" value="Add student to course"></input>
        <div className="notification">{notification}</div>
      </form>

      <h1>Students:</h1>
      <ul>
        {students.map((student) => {
          return <li onClick={setValue(studentIdRef, student.ID)} key={student.ID} id={student.ID}>{student.Name} id: {student.ID}</li>
        })}
      </ul>

      <h1>Courses:</h1>
      <ul>
      {courses.map((course, index) => {
          return <li onClick={setValue(courseIdRef, course.ID)} key={index} id={course.ID}>{course.CourseCode}</li>
        })}
      </ul>
    </div>
  )
}

export default InstructorView;