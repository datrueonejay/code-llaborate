import React, { useState, useEffect } from "react";
import TaCodeEditor from "../components/TaCodeEditor.js";
// import http from "../http";
import websocket from "../http/socketController.js";
import api from "../http/apiController.js";

import Logout from "../components/Logout.js";

import Suggestions from "../components/Suggestions";
import Chat from "../components/Chat";
import { CircularProgress, Button, CssBaseline, Grid } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSession } from "../redux/actions/userActions";
import useSharedStyles from "../styles/SharedStyles.module";
import Drawer from "../components/Drawer.js";
import useStyles from "../styles/TaStudentPageStyles.module.js";
import clsx from "clsx";
import AceEditor from "react-ace";

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
    websocket.code_listener((code) => {
      console.log("settings code");
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
      <Link to="/sessions">
        <Button
          variant="contained"
          onClick={() => {
            api.stopSession(session).then((res) => {
              dispatch(setSession(null));
              console.log(res);
              // returnToSessions();
            });
          }}
          color="primary"
        >
          Destroy and Leave Session
        </Button>
      </Link>
      <div className={styles.bodyContainer}>
        <TaCodeEditor
          onCodeChange={(code) => {
            websocket.send_code(code);
          }}
          onExecute={(code) =>
            api.executePython(code).then((res) => {
              console.log(res);
            })
          }
          code={code}
          onReadFile={(code) => setCode(code)}
        />
        <Suggestions suggestions={suggestions} />
        <div className={sharedStyles.flexGrow}>
          <div className={sharedStyles.subTitle}>Code Output</div>
          <AceEditor
            id="AceEditor2"
            mode="python"
            theme="monokai"
            name="AceEditor2"
            value={pythonOut}
            fontSize={14}
            width="100%"
            readOnly
            highlightActiveLine={false}
            wrapEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}

export default TeachingAssistantView;
