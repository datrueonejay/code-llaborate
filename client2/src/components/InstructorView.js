import React, { useEffect, useState, useRef } from 'react';
import "../App.css";
import styles from "../scss/InstructorView.module.scss";

function InstructorView(props) {
  const api = require("../api.js");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const formRef = useRef(null);
  const studentIdRef = useRef(null);
  const courseIdRef = useRef(null);
  const filterStudentRef = useRef(null);
  const filterCourseRef = useRef(null);
  const studentListRef = useRef(null);
  const courseListRef = useRef(null);

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
      ref.current.value = id;
    }
  }

  function filterList(inputRef, listRef) {
    return function(e) {
      // this should be called when user types into the input
      let input = inputRef.current.value.toUpperCase(); // what the user typed in
      let list = listRef.current.querySelectorAll("li");

      for(let i = 0; i < list.length ; i++) {
        let li, text;
        li = list[i];
        text = li.textContent || li.innerText; // text of the list
        if (text.toUpperCase().indexOf(input) > -1) {
          li.style.display = "";
        } else {
          li.style.display = "none";
        }
      }
      
    }
  }

  // TODO: Clean up this pile of mess
  return (
    <div>
      <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
        <h1 className="text-center">Add student to course</h1>
        <input className={styles.input} ref={studentIdRef} type="text" id="studentID" name="studentID" placeholder="Student ID"></input>
        <input className={styles.input} ref={courseIdRef} type="text" id="courseID" name="courseID" placeholder="Course ID"></input>
        <input className={styles.input} type="submit" value="Add student to course"></input>
        <div className="notification">{notification}</div>
      </form>

      <div id="id-selector">
        <div id="filter-student">
          <input className={styles.input} ref={filterStudentRef} type="text" onKeyUp={filterList(filterStudentRef, studentListRef)} placeholder="Filter"></input>
        </div>
        <h1>Students:</h1>
        <ul className={styles['list-wrapper']} ref={studentListRef}>
          {students.map((student) => {
            return <li className={styles.list} onClick={setValue(studentIdRef, student.ID)} key={student.ID} id={student.ID}>{student.Name} id: {student.ID}</li>
          })}
        </ul>

        <div id="filter-course">
          <input className={styles.input} ref={filterCourseRef} type="text" onKeyUp={filterList(filterCourseRef, courseListRef)} placeholder="Filter"></input>
        </div>
        <h1>Courses:</h1>
        <ul className={styles['list-wrapper']} ref={courseListRef}>
        {courses.map((course, index) => {
            return <li className={styles.list} onClick={setValue(courseIdRef, course.ID)} key={index} id={course.ID}>{course.CourseCode}</li>
          })}
        </ul>
      </div>

    </div>
  )
}

export default InstructorView;