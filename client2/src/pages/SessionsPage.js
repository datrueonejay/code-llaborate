import React, { useState, useEffect } from "react";
// import Editor from "../containers/Editor.js";
import { TYPE_TA, TYPE_STUDENT } from "../Constants";
// import http from "../http";
import api from "../http/apiController.js";
import Logout from "../components/Logout.js";

import { useSelector, useDispatch } from "react-redux";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Button,
  Drawer,
  AppBar,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { setSession } from "../redux/actions/userActions";

import useSharedStyles from "../styles/SharedStyles.module";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import useStyles from "../styles/SessionsPageStyles.module";
export default function Sessions(props) {
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [formNotification, setFormNotification] = useState("");
  const dispatch = useDispatch();

  const role = useSelector((state) => state.userReducer.userType);
  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  useEffect(() => {
    if (role === TYPE_STUDENT) {
      api
        .getSessions()
        .then((res) => {
          console.log(res);
          setCourses(res);
        })
        .catch((err) => console.log(err));
    } else if (role === TYPE_TA) {
      api
        .getUserCourses()
        .then((res) => {
          console.log(res);
          setCourses(res);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function joinCourse(e) {
    e.preventDefault();

    api.joinCourse(courseCode).then((res) => {
      console.log("joined course");
      setFormNotification("Successfully joined course!");
    });
  }

  function handleChange(e) {
    setCourseCode(e.target.value);
  }

  return (
    <div className={sharedStyles.background}>
      <div className={sharedStyles.title}>Code-llaborate</div>

      <Logout />

      <form onSubmit={joinCourse}>
        <div className={styles.joinCourseContainer}>
          <TextField
            id="courseCode"
            fullWidth={true}
            label="Course Code"
            name="courseCode"
            onChange={handleChange}
            variant="filled"
            helperText="The course Code, for example, 241tw5ge48hre15tewg48rh51r"
            required
          />
          <Button type="submit" color="primary" variant="contained">
            Join Course
          </Button>
          <div id="notification">{formNotification}</div>
        </div>
      </form>
      <List>
        <ListSubheader component="div">Courses</ListSubheader>
        {courses.map((courseInfo, index) => {
          let course = courseInfo.course;
          let sessionExists = courseInfo.exists;
          return (
            <ListItem
              button
              onClick={() => {
                if (role === TYPE_STUDENT || sessionExists) {
                  api
                    .joinSession(course)
                    .then((res) => {
                      console.log(res);
                      dispatch(setSession(course));
                      props.history.push(
                        role === TYPE_STUDENT ? "/student" : "/ta"
                      );
                    })
                    .catch((err) => console.log(err));
                } else if (role === TYPE_TA) {
                  api
                    .startSession(course)
                    .then((res) => {
                      dispatch(setSession(course));

                      console.log(res);
                      props.history.push("/ta");
                    })
                    .catch((err) => console.log(err));
                }
              }}
            >
              <ListItemIcon>
                {role === TYPE_STUDENT || sessionExists ? (
                  <PlayArrowRoundedIcon />
                ) : (
                  <AddRoundedIcon />
                )}
              </ListItemIcon>
              <ListItemText
                className={styles.sessionText}
                primary={
                  role === TYPE_STUDENT || sessionExists
                    ? `Join Session for course ${course}`
                    : `Create Session for course ${course}`
                }
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

//export default StudentView;
