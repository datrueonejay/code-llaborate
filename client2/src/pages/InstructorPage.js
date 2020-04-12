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
    coursePage: 0,
    userPage: 0,
  });

  const sharedStyles = useSharedStyles();

  const formRef = useRef(null);

  useEffect(() => {
    getUsers();
    getCourses(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getUsers(page=0) {
    api.getUsers(page).then((res) => {
      setStudents(res);
    });
  }

  function getCourses(page=0) {
    api.getCourses(page).then((res) => {
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

  useEffect(() => {
    getUsers(values.userPage); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.userPage]);

  useEffect(() => {
    getCourses(values.coursePage); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.coursePage]);

  useEffect(() => {
    if (values.userPage > 1 && students.length === 0) {
      setValues({...values, userPage: values.userPage - 1});
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  useEffect(() => {
    if (values.coursePage > 1 && courses.length === 0) {
      setValues({...values, coursePage: values.coursePage - 1});
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);


  const nextUserPage = () => {
    setValues({...values, userPage: values.userPage + 1});
  }

  const prevUserPage = () => {
    if (values.userPage > 0) {
      setValues({...values, userPage: values.userPage - 1});
    }
  }

  const nextCoursePage = () => {
    setValues({...values, coursePage: values.coursePage + 1});
  }

  const prevCoursePage = () => {
    if (values.coursePage > 0)  {
      setValues({...values, coursePage: values.coursePage - 1});
    }
  }

  const styles = useStyles();

  return (
    <div className={clsx(sharedStyles.background, sharedStyles.hideOverflowY)}>
      <Logout />
      <CourseModal open={values.modal} />
      <div className={styles.notificationClass}>{notification}</div>

      <form className={styles.formClass} ref={formRef} onSubmit={handleSubmit}>
        <Typography color="textPrimary" variant="h6">
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

        <div style={{display: "inline-block", width: "50vw"}}>
          <Typography color="textPrimary" variant="h6">
            Users
          </Typography>

          <ContentList
            nextPage={nextUserPage}
            prevPage={prevUserPage}
            type="users"
            setValue={setValue}
            value="studentId"
            list={students}
            helperText="Filter by name"
          />
        </div>

        <div className={styles.studentsClass} style={{display: "inline-block", width: "50vw"}}>
          <Typography color="textPrimary" variant="h6">
            Courses
          </Typography>
          <ContentList
            nextPage={nextCoursePage}
            prevPage={prevCoursePage}
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
