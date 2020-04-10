/**
 * credits: https://serverless-stack.com/chapters/create-a-login-page.html
 */

import React, { useState } from "react";
import "./Home.css";
import { useDispatch } from "react-redux";
import { setType, setAuth } from "../redux/actions/userActions";
import "../scss/Home.scss";

import {
  TextField,
  Button,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";

import { TYPE_INSTRUCTOR } from "../Constants.js";
import { Link } from "react-router-dom";
const authentication = require("../http/autheticationController");

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  let submit = (e) => {
    e.preventDefault();
    console.log(e);
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
    if (err) return console.log(err);
    dispatch(setType(res.role));
    dispatch(setAuth(true));
    let url = res.role === TYPE_INSTRUCTOR ? "/instructor" : "/sessions";
    props.history.push(url);
  };

  return (
    <div className="Login">
      <h1>Code-llaborate</h1>
      <form className="form" onSubmit={(e) => submit(e)}>
        <TextField
          id="username"
          label="Username"
          type="text"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
      <Link to="/signup">Sign Up Here</Link>
    </div>
  );
}
