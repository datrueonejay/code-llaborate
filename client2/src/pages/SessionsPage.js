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
} from "@material-ui/core";
import { setSession } from "../redux/actions/userActions";

export default function Sessions(props) {
  const [courses, setCourses] = useState([]);
  const dispatch = useDispatch();

  const role = useSelector((state) => state.userReducer.userType);

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

  return (
    <div>
      <Logout />
      {courses.map((courseInfo, index) => {
        let course = courseInfo.course;
        let sessionExists = courseInfo.exists;
        return (
          <div key={index}>
            <li>{course}</li>
            <Button
              variant="contained"
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
              {" "}
              {role === TYPE_STUDENT || sessionExists
                ? "Join Session"
                : "Create Session"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

//export default StudentView;
