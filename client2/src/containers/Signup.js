/**
 * credit: https://serverless-stack.com/chapters/create-the-signup-form.html
 */

import React, { useState } from "react";
import {
  Button,
  FormGroup,
  FormControl,
  FormLabel, 
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import "./Signup.css";

export default function Signup(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [authenticated, setauthenticated] = useState("false");
  const [name, setName] = useState("");
  const api = require('../api.js');


  async function handleSubmit(event) {
    event.preventDefault();
    api.addUser(username, password, 1, name, function(){
      props.onChange(true);
    });
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="name">
          <FormLabel>Name</FormLabel>
          <FormControl
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>
        <FormLabel>
        Choose your role:
        <select class="custom-select">
          <option selected>Open this select menu</option>
          <option value="1">Student</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
        </FormLabel>
        <Button type="submit" class="btn">
          Signup
        </Button>

      </form>
    );
  }

  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}