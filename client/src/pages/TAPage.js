import React, { useState, useEffect } from "react";
import TaCodeEditor from "../components/TaCodeEditor.js";
import websocket from "../http/socketController.js";

import api from "../http/apiController.js";

import Suggestions from "../components/Suggestions";
import { CircularProgress, Button } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { setSession } from "../redux/actions/userActions";
import useSharedStyles from "../styles/SharedStyles.module";
import Drawer from "../components/Drawer.js";
import useStyles from "../styles/TaStudentPageStyles.module.js";
import clsx from "clsx";
import PythonOutput from "../components/PythonOutput.js";

function TeachingAssistantView(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);
  const [code, setCode] = useState("");
  const [connecting, setConnecting] = useState(true);

  const session = useSelector((state) => state.userReducer.session);
  const dispatch = useDispatch();
  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  useEffect(() => {
    websocket.connect(
      () => {
        setConnecting(false);
      },
      () => {}
    );
    websocket.code_listener((newCode) => {
      setCode(newCode);
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
          api.stopSession(session).then((res) => {
            dispatch(setSession(null));
            props.history.push("/sessions");
          });
        }}
        leaveText={"End and Leave Session"}
      />
      <div className={styles.bodyContainer}>
        <div className={sharedStyles.sessionEditorDiv}>
        <TaCodeEditor
          onCodeChange={(code) => {
            setCode(code);
            websocket.send_code(code);
          }}
          onExecute={(code) => api.executePython(code).then((res) => {})}
          code={code}
          onReadFile={(code) => setCode(code)}
        />
        </div>
        <div className={sharedStyles.sessionSuggestionDiv}>

        <Suggestions suggestions={suggestions} />
        </div>
      </div>
      <div className={styles.bodyContainer}>
      <PythonOutput pythonOut={pythonOut} />
      </div>
    </div>
  );
}

export default TeachingAssistantView;
