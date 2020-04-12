import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// new
import Home from "./pages/HomePage.js";
import StudentView from "./pages/StudentPage.js";
import TeachingAssistantView from "./pages/TAPage.js";

import Sessions from "./pages/SessionsPage";

import InstructorView from "./pages/InstructorPage.js";
import SignUp from "./pages/SignUpPage";
import NotFound from "./pages/NotFoundPage";


// Import a Mode (language)
import "brace/mode/python";
import "brace/mode/text";

// Import a Theme
import "brace/theme/monokai";
import "brace/theme/terminal";

// Import Extra tools
import "brace/ext/language_tools";


const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#778899",
    },
  },
});

function App() {
  const type = useSelector((state) => state.userReducer.userType);

  // Private route notes: the redirect currently goes to login, wen eed to make an unauthorized page or a 404 page ?? TODO
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/sessions" component={Sessions} />
          <Route path="/signup" component={SignUp} />
          <PrivateRoute path="/student" for="STUDENT" component={StudentView} />
          <PrivateRoute
            path="/ta"
            for="TEACHING ASSISTANT"
            component={TeachingAssistantView}
          />
          <PrivateRoute
            path="/instructor"
            for="INSTRUCTOR"
            component={InstructorView}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
