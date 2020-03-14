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

export default function Signup(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const api = require('../api.js');

  function validateForm() {
    return username.length > 0 && password.length && name.length> 0;
  }


  // async
  async function handleSubmit(event) {
    event.preventDefault();
    let e = document.getElementById("roleid");
    let role = e.options[e.selectedIndex].value;
    api.addUser(username, password, role, name, function(){
      props.onChange(true);
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
          <option value="1">Open this select menu</option>
          <option value="STUDENT">Student</option>
          <option value="TA">TA</option>
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