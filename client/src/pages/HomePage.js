/**
 * credits: https://serverless-stack.com/chapters/create-a-login-page.html
 */

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setType, setAuth } from "../redux/actions/userActions";
import useStyles from "../styles/HomePageStyles.module";
import useSharedStyles from "../styles/SharedStyles.module";

import { TextField, Button, Grid, Typography } from "@material-ui/core";

import { TYPE_INSTRUCTOR } from "../Constants.js";
import { Link } from "react-router-dom";
const authentication = require("../http/autheticationController");

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationText, setNotificationText] = useState("");
  const dispatch = useDispatch();

  const homePageStyles = useStyles();
  const sharedStyles = useSharedStyles();

  let submit = (e) => {
    e.preventDefault();
    authentication
      .login(username, password)
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
      <div className={sharedStyles.title}>Code-llaborate</div>
      <form onSubmit={(e) => submit(e)} className={homePageStyles.loginForm}>
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
            <Button variant="contained" fullWidth type="submit" color="primary">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
      <Link to="/signup" className={homePageStyles.signUpElement}>
        Sign Up Here
      </Link>
      <Link to="/credits" className={homePageStyles.signUpElement}>
        Credits
      </Link>
      <Typography align="center" color="error">
        {notificationText}
      </Typography>
    </Grid>
  );
}
