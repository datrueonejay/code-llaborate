import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// new
import Home from "./pages/HomePage.js";
import StudentView from "./pages/StudentPage.js";
import TeachingAssistantView from "./pages/TAPage.js";

import Sessions from "./pages/SessionsPage";

import InstructorView from "./pages/InstructorPage.js";
import SignUp from "./pages/SignUpPage";

function App() {
  const authenticate = useSelector((state) => state.userReducer.auth);
  const type = useSelector((state) => state.userReducer.userType);

  let isStudent = type === "STUDENT";
  console.log(authenticate);

  // Private route notes: the redirect currently goes to login, wen eed to make an unauthorized page or a 404 page ?? TODO
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute
          path="/student"
          for="STUDENT"
          component={(props) => (
            <StudentView {...props} isStudent={isStudent} />
          )}
        />
        <PrivateRoute
          path="/ta"
          for="TEACHING ASSISTANT"
          component={(props) => (
            <TeachingAssistantView {...props} isStudent={isStudent} />
          )}
        />
        <PrivateRoute
          path="/instructor"
          for="INSTRUCTOR"
          component={(props) => <InstructorView {...props} />}
        />
        <PrivateRoute
          path="/private"
          for="INSTRUCTOR"
          component={(props) => <InstructorView {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
