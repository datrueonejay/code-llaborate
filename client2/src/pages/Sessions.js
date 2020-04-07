import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import { TYPE_TA, TYPE_STUDENT } from "../Constants";
import http from "../http";
import Logout from "../components_final/Logout.js";

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

export default function Sessions(props) {
  const [courses, setCourses] = useState([]);

  const role = useSelector((state) => state.userReducer.userType);

  useEffect(() => {
    if (role === TYPE_STUDENT) {
      http
        .getSessions()
        .then((res) => {
          setCourses(res);
        })
        .catch((err) => console.log(err));
    } else if (role === TYPE_TA) {
      http
        .getCourses()
        .then((res) => {
          setCourses(res);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div>
      <Logout />
      {courses.map((course, index) => {
        return (
          <div key={index}>
            <li>{course}</li>
            <Button
              variant="contained"
              onClick={() => {
                if (role === TYPE_STUDENT) {
                  http
                    .joinSession(course)
                    .then((res) => {
                      console.log(res);
                      props.history.push("/student");
                    })
                    .catch((err) => console.log(err));
                } else if (role === TYPE_TA) {
                  http
                    .startSession(course)
                    .then((res) => {
                      console.log(res);
                      props.history.push("/ta");
                    })
                    .catch((err) => console.log(err));
                }
              }}
            >
              {" "}
              {role === TYPE_STUDENT ? "Join Session" : "Create Session"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

//export default StudentView;
