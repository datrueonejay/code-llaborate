import React, { useEffect, useState, useRef } from 'react';
import "../App.css";
import styles from "../scss/InstructorView.module.scss";
import { TextField, Button, FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';

function InstructorView(props) {
  const api = require("../api.js");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const [values, setValues] = useState({
    studentId: "",
    courseId: ""
  });

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

  // function setValue(ref, id) {
  //   return function(e) {
  //     console.log(ref.current);
  //     ref.current.focus();
  //   }
  // }

  const setStudentValue = (id) => event => {
    setValues({...values, studentId: [id]});
  };

  const setCourseValue = (id) => event => {
    setValues({...values, courseId: [id]});
  };

  function filterList(inputRef, listRef) {
    return function(e) {
      // this should be called when user types into the input
      let input = inputRef.current.value.toUpperCase(); // what the user typed in
      let list = listRef.current.querySelectorAll("li");

      for(let i = 0; i < list.length ; i++) {
        let li, text;
        li = list[i];
        text = li.textContent|| li.innerText; // text of the list
        text = text.toUpperCase();
        if (text.indexOf(input) > -1) {
          li.classList.remove("hide");
        } else {
          li.classList.add("hide");
        }
      }
      
    }
  }

  // TODO: Clean up this pile of mess
  return (
    <div>
      <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>

        <h1 className="text-center">Add student to course</h1>

        <div className={styles['form-input']}>
          {/* <TextField></TextField> */}
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="studentID">Student Id</InputLabel>
            <Input inputRef={studentIdRef} id="studentID" type="number" aria-describedby="helper-text" name="studentID" value={values.studentId} required/>
            <FormHelperText id="helper-text">The student id (e.g 3)</FormHelperText>
          </FormControl>
        </div>

        <div className={styles['form-input']}>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="courseID">Course Id</InputLabel>
            <Input ref={courseIdRef} id="courseID" type="number" aria-describedby="helper-text" name="courseID" value={values.courseId} required/>
            <FormHelperText id="helper-text">The course id (e.g 2)</FormHelperText>
          </FormControl>
        </div>
        
        <Button type="submit" color="primary" variant="contained">Add student to course</Button>

        <div className="notification">{notification}</div>
      </form>

      <div id="id-selector">

        <div id="filter-student">
          <input ref={filterStudentRef} className={styles.input} type="text" onKeyUp={filterList(filterStudentRef, studentListRef)} placeholder="Filter"></input>
        </div>

        <h1>Students:</h1>
        <ul className={styles['list-wrapper']} ref={studentListRef}>
          {students.map((student) => {
            return <li className={styles.list} onClick={setStudentValue(student.ID)} key={student.ID} id={student.ID}>{student.Name} id: {student.ID}</li>
          })}
        </ul>

        <div id="filter-course">
          <input className={styles.input} ref={filterCourseRef} type="text" onKeyUp={filterList(filterCourseRef, courseListRef)} placeholder="Filter"></input>
        </div>

        <h1>Courses:</h1>
        <ul ref={courseListRef} className={styles['list-wrapper']}>
        {courses.map((course, index) => {
            return <li className={styles.list} onClick={setCourseValue(course.ID)} key={index} id={course.ID}>{course.CourseCode}</li>
          })}
        </ul>
      </div>

    </div>
  )
}

export default InstructorView;