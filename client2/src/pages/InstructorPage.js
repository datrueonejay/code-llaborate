import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import {useStyles} from "../styles/InstructorView.module.js";
import {
  TextField,
  Button,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Link } from "react-router-dom";

function InstructorView(props) {
  const api = require("../http/apiController.js");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const [values, setValues] = useState({
    studentId: "",
    courseId: "",
    studentIdFilter: "",
    courseIdFilter: "",
    searchStudent: "",
  });

  const formRef = useRef(null);
  const studentListRef = useRef(null);
  const courseListRef = useRef(null);
  const styles = useStyles();

  useEffect(() => {
    function getStudents() {
      api.getStudents(0).then((res) => {
        setStudents(res);
      });
    }

    function getCourses() {
      api.getCourses().then((res) => {
        setCourses(res);
      });
    }

    getStudents();
    getCourses();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let studentID = formData.get("studentID");
    let courseID = formData.get("courseID");

    api
      .addStudentToCourse(studentID, courseID)
      .then((res) => {
        setNotification("Successfully added student to the course");
      })
      .catch((err) => {
        console.log(err);
        setNotification("Student is already in the course or IDs do not exist");
      })
      .finally(() => {
        formRef.current.reset();
      });
    // api.addStudentToCourse(studentID, courseID, (err, res) => {
    //   if (err) {
    //     console.log(err);
    //     setNotification("Student is already in the course or IDs do not exist");
    //   } else {
    //     setNotification("Successfully added student to the course");
    //   }
    //   formRef.current.reset();
    // });
  }

  // function setValue(ref, id) {
  //   return function(e) {
  //     console.log(ref.current);
  //     ref.current.focus();
  //   }
  // }

  function searchStudent() {
    api
      .searchStudent(values.searchStudent)
      .then((res) => {
        setStudents(res);
      })
      .catch((err) => {
        setNotification("Could not search for student. Please try again");
      });
    // api.searchStudent(values.searchStudent, (err, res) => {
    //   if (err)
    //     setNotification("Could not search for student. Please try again");
    //   setStudents(res);
    // });
  }

  const setValue = (value, id) => (event) => {
    setValues({ ...values, [value]: id });
  };

  const handleChange = (value) => (event) => {
    setValues({ ...values, [value]: event.target.value });
  };

  function filterList(input, listRef) {
    return function (e) {
      // this should be called when user types into the input
      input = input.toUpperCase(); // what the user typed in
      let list = listRef.current.querySelectorAll("span");

      for (let i = 0; i < list.length; i++) {
        let li, text;
        li = list[i];
        text = li.textContent || li.innerText; // text of the list
        text = text.toUpperCase();
        if (text.indexOf(input) > -1) {
          li.parentNode.parentNode.classList.remove("hide");
        } else {
          li.parentNode.parentNode.classList.add("hide");
        }
      }
    };
  }

  return (
    <div>
      <div className={styles.notificationClass}>{notification}</div>

      <form className={styles.formClass} ref={formRef} onSubmit={handleSubmit}>
        <h1 className="text-center">Add student to course</h1>

        <div className={styles.formInputClass}>
          <TextField
            id="studentID"
            fullWidth={true}
            label="Student Id"
            name="studentID"
            onChange={handleChange("studentId")}
            value={values.studentId}
            helperText="The student id, for example, 3"
            required
          />
        </div>

        <div className={styles.formInputClass}>
          <TextField
            id="courseID"
            fullWidth={true}
            label="Course Id"
            name="courseID"
            onChange={handleChange("courseId")}
            value={values.courseId}
            helperText="The course id, for example, 2"
            required
          />
        </div>

        <Button type="submit" color="primary" variant="contained">
          Add student to course
        </Button>
      </form>

      <div className={styles.centerClass} id="id-selector">
        <div className={styles.studentsClass}>
          <h1>Students:</h1>
          <div id="search-student">
            <TextField
              className={styles.inputClass}
              type="text"
              onChange={handleChange("searchStudent")}
              value={values.searchStudent}
              helperText="Search for a student, e.g JayQuelen"
            />
            <Button
              onClick={searchStudent}
              type="submit"
              color="primary"
              variant="contained"
            >
              Search
            </Button>
          </div>

          <div id="filter-student">
            <TextField
              className={styles.inputClass}
              type="text"
              onKeyUp={filterList(values.studentIdFilter, studentListRef)}
              onChange={handleChange("studentIdFilter")}
              helperText="Filter by student name"
              value={values.studentIdFilter}
            />
          </div>

          <ul className={styles.listWrapperClass} ref={studentListRef}>
            {students.map((student) => {
              return (
                <ListItem 
                  button
                  divider
                  onClick={setValue("studentId", student.ID)}
                  key={student.ID}
                  id={student.ID}
                >
                  <ListItemText
                    className={styles.centerClass}
                    primary={student.Name}
                    secondary={`Id: ${student.ID}`}
                  />
                </ListItem>
              );
            })}
          </ul>
        </div>


        <div className={styles.studentsClass}>
          <h1>Courses:</h1>

          <div id="filter-course">
            <TextField
              className={styles.inputClass}
              type="text"
              helperText="Filter by course name"
              onKeyUp={filterList(values.courseIdFilter, courseListRef)}
              onChange={handleChange("courseIdFilter")}
              value={values.courseIdFilter}
            />
          </div>

          <ul ref={courseListRef} className={styles.formClass}>
            {courses.map((course, index) => {
              return (
                <ListItem
                  button
                  divider
                  onClick={setValue("courseId", course.ID)}
                  key={index}
                  id={course.ID}
                >
                  <ListItemText
                  className={styles.inputClass}
                    primary={course.CourseCode}
                    secondary={`Id: ${course.ID}`}
                  />
                </ListItem>
              );
            })}
          </ul>
        </div>
      </div>
      <Link to="/private">Private</Link>
    </div>
  );
}

export default InstructorView;
