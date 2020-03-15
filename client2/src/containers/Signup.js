/**
 * credit: https://serverless-stack.com/chapters/create-the-signup-form.html
 */

import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel, 
} from "react-bootstrap";
import "./Signup.css";
import { useDispatch } from 'react-redux';
import { setType, setAuth } from '../redux/actions/userActions';

export default function Signup(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const api = require('../api.js');

  const dispatch = useDispatch()

  function validateForm() {
    return username.length > 0 && password.length && name.length> 0;
  }


  // async
  function handleSubmit(event) {
    event.preventDefault();
    let e = document.getElementById("roleid");
    let role = e.options[e.selectedIndex].value;
    api.addUser(username, password, role, name, function(err, res){
      if (err) return console.log(err);
      dispatch(setAuth(true));
      dispatch(setType(role));
      let url = "";
      console.log(res.role);
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

  function renderForm() {
    return (
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
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="username">
          <FormLabel>Full Name</FormLabel>
          <FormControl
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>
        <FormLabel className="role">
        Choose your role:
        <select id="roleid" className="custom-select">
          <option value="STUDENT">Student</option>
          <option value="TEACHING ASSISTANT">TA</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>
        </FormLabel>
        <Button block disabled={!validateForm()} type="submit" className="btn">
          Signup
        </Button>

      </Form>
    );
  }

  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}