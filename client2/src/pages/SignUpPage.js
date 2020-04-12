/**
 * credits: https://serverless-stack.com/chapters/create-a-login-page.html
 */

import React, { useState } from "react";
// import "./Home.css";
import { useDispatch } from "react-redux";
import { setType, setAuth } from "../redux/actions/userActions";
import useStyles from "../styles/HomePageStyles.module";
import useSharedStyles from "../styles/SharedStyles.module";

import { Link } from "react-router-dom";

import {
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
  Grid,
  FormControl,
} from "@material-ui/core";

import { TYPE_INSTRUCTOR } from "../Constants.js";
const authentication = require("../http/autheticationController");

export default function SignUp(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [notificationText, setNotificationText] = useState("");

  const dispatch = useDispatch();
  const homePageStyles = useStyles();
  const sharedStyles = useSharedStyles();
  let submit = (e) => {
    e.preventDefault();

    authentication
      .signup(username, password, role, name)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err, null);
      });
  };

  let callback = (err, res) => {
    if (err) {
      console.error(err);
      return setNotificationText(err);
    }
    dispatch(setType(res.role));
    dispatch(setAuth(true));
    let url = res.role === TYPE_INSTRUCTOR ? "/instructor" : "/sessions";
    props.history.push(url);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={homePageStyles.loginPage}
    >
      {" "}
      <div className={sharedStyles.title}>Code-llaborate</div>
      <form
        onSubmit={(e) => submit(e)}
        className={homePageStyles.loginForm}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              id="username"
              label="Username"
              type="text"
              variant="filled"
              required
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="filled"
              required
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id="name"
              label="Name"
              type="text"
              variant="filled"
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <FormControl required className={sharedStyles.fullwidth}>
              <InputLabel id="label">Role</InputLabel>
              <Select
                labelId="label"
                id="roleSelect"
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="TEACHING ASSISTANT">TA</MenuItem>
                <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
      <Link to="/" className={homePageStyles.signUpElement}>
        Back to login
      </Link>
      <div className={sharedStyles.errorText}>{notificationText}</div>
    </Grid>
  );
}
