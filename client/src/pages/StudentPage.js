import React, { useState, useEffect } from "react";
import websocket from "../http/socketController.js";

import clsx from "clsx";

import { CircularProgress, Button } from "@material-ui/core";

import Drawer from "../components/Drawer.js";
import StudentCodeEditor from "../components/StudentCodeEditor.js";
import StudentSuggestion from "../components/StudentSuggestion.js";

import Suggestions from "../components/Suggestions";

import useStyles from "../styles/TaStudentPageStyles.module.js";

import { setSession } from "../redux/actions/userActions";

import useSharedStyles from "../styles/SharedStyles.module";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import PythonOutput from "../components/PythonOutput.js";

export default function StudentView(props) {
  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);

  const [connecting, setConnecting] = useState(false);

  const styles = useStyles();
  const sharedStyles = useSharedStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    websocket.connect(
      () => {
        setConnecting(false);
      },
      () => {}
    );
    websocket.code_listener((code) => {
      setCode(code);
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

    return () => {
      websocket.close();
    };
  }, []);

  if (connecting) {
    return (
      <div className={clsx(sharedStyles.background, styles.container)}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={clsx(sharedStyles.background, styles.container)}>
      <Drawer
        chatOut={chatOut}
        sendChat={(message) => {
          websocket.send_chat(message);
        }}
        onLeave={() => {
          dispatch(setSession(null));
          props.history.push("/sessions");
        }}
        leaveText={"Leave Session"}
      />

      <div className={styles.bodyContainer}>
        <StudentCodeEditor code={code} />
        <div
          className={clsx(
            sharedStyles.flexGrow,
            styles.studentSuggestionContainer
          )}
        >
          <div className={sharedStyles.sessionSuggestion}>
            <Suggestions suggestions={suggestions} height={300} />

            <StudentSuggestion
              onSuggest={(lineNum, code) => {
                websocket.send_suggestion(lineNum, code);
              }}
            />
          </div>
        </div>
      </div>
      <PythonOutput pythonOut={pythonOut} />
    </div>
  );
}
