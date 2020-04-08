import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

//old
import Login from "./containers/Login.js";
import Signup from "./containers/Signup.js";
// import Editor from "./containers/Editor.js";
// import Home from "./components/Home.js";
// import StudentView from "./components/StudentView";
// import TeachingAssistantView from "./components/TeachingAssistantView";

// new
import Home from "./pages/HomePage.js";
import StudentView from "./pages/StudentPage.js";
import TeachingAssistantView from "./pages/TAPage.js";

import { setAuth } from "./redux/actions/userActions";
// import SelectCourse from "./containers/SelectCourse";
import Sessions from "./pages/SessionsPage";

import InstructorView from "./components/InstructorView";

function App() {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  // const [authenticate, setAuthenticate] = useState(false);
  let timeout = null;

  const authenticate = useSelector((state) => state.userReducer.auth);
  const type = useSelector((state) => state.userReducer.userType);
  const dispatch = useDispatch();

  let isStudent = type === "STUDENT";
  console.log(authenticate);

  // Private route notes: the redirect currently goes to login, wen eed to make an unauthorized page or a 404 page ?? TODO
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/sessions" component={Sessions} />
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
