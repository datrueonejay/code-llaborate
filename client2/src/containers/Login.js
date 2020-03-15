/**
 * credits: https://serverless-stack.com/chapters/create-a-login-page.html
 */

import React, { useState } from "react";
import {
  Form,
  Button,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
import { Redirect } from 'react-router-dom'
import "./Login.css";
import { useDispatch } from "react-redux";
import { setType, setAuth } from "../redux/actions/userActions";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const api = require("../api.js");

  const dispatch = useDispatch();

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    api.checkUser(username, password, function(err, res) {
      console.log(res);
      if (err) return console.log(err);
      dispatch(setType(res.role));
      dispatch(setAuth(true));
      let url = "";
      switch(res.role) {
        case "STUDENT":
            url = "/student";
            break;
        case "TEACHING ASSISTANT":
          url = "/ta"
          break;
        case "INSTRUCTOR":
          url = "/instructor";
          break;
        default:
          url = "/login";
          break;
      }

      props.history.push(url);
      
    });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <FormGroup className="username">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}
