import React, { useState, useEffect } from "react";
// import Editor from "../containers/Editor.js";
import websocket from "../http/socketController.js";

//import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

import { CssBaseline, CircularProgress, Button } from "@material-ui/core";

// import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Logout from "../components/Logout.js";
import Drawer from "../components/Drawer.js";
import StudentCodeEditor from "../components/StudentCodeEditor.js";
import StudentSuggestion from "../components/StudentSuggestion.js";

import Suggestions from "../components/Suggestions";
import Chat from "../components/Chat";
// import { useStyles } from "../styles/StudentPageStyle.js";
import useStyles from "../styles/TaStudentPageStyles.module.js";

import { setSession } from "../redux/actions/userActions";

import useSharedStyles from "../styles/SharedStyles.module";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AceEditor from "react-ace";
import PythonOutput from "../components/PythonOutput.js";

export default function StudentView(props) {
  // const [courses, setCourses] = useState([]);
  // const [isSession, setIsSession] = useState(false);
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);

  const [connecting, setConnecting] = useState(false);

  const styles = useStyles();
  const sharedStyles = useSharedStyles();
  // const theme = useTheme();

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  const dispatch = useDispatch();

  useEffect(() => {
    websocket.connect(
      () => {
        console.log("Connected successfully!");
        setConnecting(false);
      },
      () => {
        console.log("Could not connect");
      }
    );
    websocket.code_listener((message) => {
      setCode(message);
    });
    websocket.suggestion_listener((suggestion) => {
      setSuggestions((old) => old.concat(suggestion));
    });
    websocket.python_listener((output) => {
      setPythonOut((old) => old.concat(output));
    });
    websocket.chat_listener((message) => {
      setChatOut((old) => old.concat(message));
    });
  }, []);

  if (connecting) {
    return <CircularProgress />;
  }

  return (
    <div className={clsx(sharedStyles.background, styles.container)}>
      <Drawer
        chatOut={chatOut}
        sendChat={(message) => {
          console.log(message);
          websocket.send_chat(message);
        }}
      />
      <Link to="/sessions">
        <Button
          variant="contained"
          onClick={() => {
            dispatch(setSession(null));
          }}
          color="primary"
        >
          Leave Session
        </Button>
      </Link>
      <div className={styles.bodyContainer}>
        <StudentCodeEditor code={code} />
        <div
          className={clsx(
            sharedStyles.flexGrow,
            styles.studentSuggestionContainer
          )}
        >
          <Suggestions suggestions={suggestions} height={300} />

          <StudentSuggestion
            onSuggest={(lineNum, code) => {
              websocket.send_suggestion(lineNum, code);
            }}
          />
        </div>
        <PythonOutput pythonOut={pythonOut} />
      </div>
    </div>
  );
}
