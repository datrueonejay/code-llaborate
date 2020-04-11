import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import { useStyles } from "../styles/InstructorView.module.js";
import { TextField, Button, Typography } from "@material-ui/core";
import CourseModal from "../components/CourseModal";
import ContentList from "../components/ContentList";
import clsx from "clsx";
import Logout from "../components/Logout";

import useSharedStyles from "../styles/SharedStyles.module";

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
    modal: false,
  });

  const sharedStyles = useSharedStyles();

  const formRef = useRef(null);

  useEffect(() => {
    getUsers();
    getCourses();
  }, []);

  function getUsers() {
    api.getUsers(0).then((res) => {
      setStudents(res);
    });
  }

  function getCourses() {
    api.getCourses().then((res) => {
      setCourses(res);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let userID = formData.get("userID");
    let courseID = formData.get("courseID");

    api
      .addToCourse(userID, courseID)
      .then((res) => {
        setNotification("Successfully added user to the course");
      })
      .catch((err) => {
        console.log(err);
        setNotification("User is already in the course or IDs do not exist");
      })
      .finally(() => {
        formRef.current.reset();
      });
  }

  // function setValue(ref, id) {
  //   return function(e) {
  //     console.log(ref.current);
  //     ref.current.focus();
  //   }
  // }

  function searchStudent() {
    if (values.searchStudent === "") {
      getUsers();
    } else {
      api
        .searchUser(values.searchStudent)
        .then((res) => {
          setStudents(res);
        })
        .catch((err) => {
          setNotification("Could not search for student. Please try again");
        });
    }
  }

  const setValue = (value, id) => (event) => {
    setValues({ ...values, [value]: id });
  };

  const handleChange = (value) => (event) => {
    setValues({ ...values, [value]: event.target.value });
  };

  const styles = useStyles();

  return (
    <div className={clsx(sharedStyles.background)}>
      <Logout />
      <CourseModal open={values.modal} />
      <div className={styles.notificationClass}>{notification}</div>

      <form className={styles.formClass} ref={formRef} onSubmit={handleSubmit}>
        <Typography color="textPrimary" variant="h3">
          Add student or TA to course
        </Typography>
        {/* <h1 className="text-center">Add student or TA to course</h1> */}

        <div className={styles.formInputClass}>
          <TextField
            id="userID"
            fullWidth={true}
            label="User Id"
            name="userID"
            onChange={handleChange("studentId")}
            value={values.studentId}
            helperText="The user id, for example, 3"
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
          Add to course
        </Button>
      </form>

      <div className={styles.centerClass} id="id-selector">
        <div className={styles.studentsClass}>
          <h1>Users:</h1>
          <div id="search-user">
            <TextField
              className={styles.inputClass}
              type="text"
              onChange={handleChange("searchStudent")}
              value={values.searchStudent}
              helperText="Search for a User, e.g JayQuelen"
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

          <ContentList
            type="users"
            setValue={setValue}
            value="studentId"
            list={students}
            helperText="Filter by title"
          />
        </div>

        <div className={styles.studentsClass}>
          <h1>Courses:</h1>
          <ContentList
            type="courses"
            setValue={setValue}
            value="courseId"
            list={courses}
            helperText="Filter by Course code"
          />
        </div>
      </div>
    </div>
  );
}

export default InstructorView;
