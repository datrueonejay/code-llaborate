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
    courseId: "",
    studentIdFilter: "",
    courseIdFilter: "",
  });

  const formRef = useRef(null);
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
  
  const setValue = (value, id) => event => {
    setValues({...values, [value]: id});
  }

  const handleChange = value => event => {
    setValues({...values, [value]: event.target.value});
  }

  function filterList(input, listRef) {
    return function(e) {
      // this should be called when user types into the input
      input = input.toUpperCase(); // what the user typed in
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
          <TextField 
            id="studentID"
            fullWidth={true}
            label="Student Id"
            name="studentID"
            onChange={handleChange('studentId')}
            value={values.studentId}
            helperText="The student id, for example, 3"
            required
          />
        </div>

        <div className={styles['form-input']}>
          <TextField 
            id="courseID"
            fullWidth={true}
            label="Course Id"
            name="courseID"
            onChange={handleChange('courseId')}
            value={values.courseId}
            helperText="The course id, for example, 2"
            required
          />
        </div>
        
        <Button type="submit" color="primary" variant="contained">Add student to course</Button>

        <div className="notification">{notification}</div>
      </form>

      <div id="id-selector">
        <h1>Students:</h1>

        <div id="filter-student">
          <TextField 
            className={styles.input} 
            type="text" 
            onKeyUp={filterList(values.studentIdFilter, studentListRef)} 
            onChange={handleChange('studentIdFilter')} 
            value={values.studentIdFilter} />
        </div>

        <ul className={styles['list-wrapper']} ref={studentListRef}>
          {students.map((student) => {
            return <li 
                    className={styles.list} 
                    onClick={setValue("studentId",student.ID)} 
                    key={student.ID} 
                    id={student.ID}
                    >
                    {student.Name} id: {student.ID}
                    </li>
          })}
        </ul>

        <h1>Courses:</h1>

        <div id="filter-course">
          <TextField 
            className={styles.input} 
            type="text" 
            onKeyUp={filterList(values.courseIdFilter, courseListRef)} 
            onChange={handleChange('courseIdFilter')} 
            value={values.courseIdFilter} />
        </div>
        
        <ul ref={courseListRef} className={styles['list-wrapper']}>
        {courses.map((course, index) => {
            return <li 
              className={styles.list} 
              onClick={setValue("courseId", course.ID)} 
              key={index} 
              id={course.ID}
              >
              {course.CourseCode}
              </li>
          })}
        </ul>
      </div>

    </div>
  )
}

export default InstructorView;