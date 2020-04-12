import React, { useState, useEffect } from "react";
import TaCodeEditor from "../components/TaCodeEditor.js";
import SocketConnection from "../http/socketController.js";

import api from "../http/apiController.js";

import Suggestions from "../components/Suggestions";
import { CircularProgress, Button } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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
  const session = useSelector((state) => state.userReducer.session);

  const [connecting, setConnecting] = useState(true);

  const dispatch = useDispatch();
  const sharedStyles = useSharedStyles();
  const styles = useStyles();
  const websocket = new SocketConnection(
    () => {
      setConnecting(false);
    },
    () => {}
  );

  const suggestionListener = (suggestion) => {
    setSuggestions((old) => old.concat(suggestion));
  };

  useEffect(() => {
    websocket.code_listener((code) => {
      setCode(code);
    });

    websocket.suggestion_listener(suggestionListener);
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
          websocket.send_chat(message);
        }}
      />
      <div className={sharedStyles.leaveSession}>
        <Link to="/sessions">
          <Button
            variant="contained"
            onClick={() => {
              api.stopSession(session).then((res) => {
                dispatch(setSession(null));
              });
            }}
            color="primary"
          >
            Destroy and Leave Session
          </Button>
        </Link>
      </div>
      <div className={styles.bodyContainer}>
        <TaCodeEditor
          onCodeChange={(code) => {
            websocket.send_code(code);
          }}
          onExecute={(code) => api.executePython(code).then((res) => {})}
          code={code}
          onReadFile={(code) => setCode(code)}
        />
        <Suggestions suggestions={suggestions} />
      </div>
      <PythonOutput pythonOut={pythonOut} />
    </div>
  );
}

export default TeachingAssistantView;
