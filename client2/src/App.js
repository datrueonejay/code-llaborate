import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
// import Http from "./http.js";
// import http from "./http";
import Login from "./containers/Login.js";
import Signup from "./containers/Signup.js";
import Editor from "./containers/Editor.js";
import Home from './components/Home.js';
import { setAuth } from "./redux/actions/userActions";
import SelectCourse from "./containers/SelectCourse";

import StudentView from './components/StudentView';
import TeachingAssistantView from './components/TeachingAssistantView';
import InstructorView from "./components/InstructorView";


function App() {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  // const [authenticate, setAuthenticate] = useState(false);
  let timeout = null;

  const authenticate = useSelector(state => state.userReducer.auth);
  const type = useSelector(state => state.userReducer.userType);
  const dispatch = useDispatch();

  let isStudent = type === "STUDENT";

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/signup' component={Signup} />
        <Route path='/login' component={Login} />
        <Route path='/student' render={(props)=> <StudentView {...props} isStudent={isStudent}/>} />
        <Route path='/ta' render={(props)=> <TeachingAssistantView {...props} isStudent={isStudent}/>} />
        <Route path='/instructor' render={(props)=> <InstructorView {...props} />}/>
      </Switch>
    </Router>
  )
}

export default App;
