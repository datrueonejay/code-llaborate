/**
 * credits: https://serverless-stack.com/chapters/create-a-login-page.html
 */

import React, { useState } from "react";
import { Redirect } from "react-router-dom";
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
const api = require("../api.js");

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  let submit = (login) => {
    if (login) {
      api.checkUser(username, password, callback);
    } else {
      if (!name) {
        alert("Ensure name is set");
      } else {
        api.addUser(username, password, role, name, callback);
      }
    }
  };

  let callback = (err, res) => {
    if (err) return console.log(err);
    dispatch(setType(res.role));
    dispatch(setAuth(true));
    let url = "/sessions";
    // switch (res.role) {
    //   case "STUDENT":
    //     url = "/student";
    //     break;
    //   case "TEACHING ASSISTANT":
    //     url = "/ta";
    //     break;
    //   case "INSTRUCTOR":
    //     url = "/instructor";
    //     break;
    //   default:
    //     url = "/";
    //     break;
    // }

    props.history.push(url);
  };

  return (
    <div className="Login">
      <h1>Code-llaborate</h1>
      <form className="form">
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
        <TextField
          id="name"
          label="Name (Required for Sign Up)"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <InputLabel id="label">Role</InputLabel>
        <Select
          labelId="label"
          id="roleSelect"
          required
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="TEACHING ASSISTANT">TA</MenuItem>
          <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
        </Select>
        <Button variant="contained" onClick={(e) => submit(true)}>
          Login
        </Button>
        <Button variant="contained" onClick={(e) => submit(false)}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
