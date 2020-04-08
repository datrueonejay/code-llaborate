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
const authentication = require("../http/autheticationController");

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  let submit = (login) => {
    if (login) {
      authentication
        .login(username, password)
        .then((res) => {
          callback(null, res);
        })
        .catch((err) => {
          callback(err, null);
        });
    } else {
      if (!name) {
        alert("Ensure name is set");
      } else {
        authentication
          .signup(username, password, role, name)
          .then((res) => {
            callback(null, res);
          })
          .catch((err) => {
            callback(err, null);
          });
      }
    }
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