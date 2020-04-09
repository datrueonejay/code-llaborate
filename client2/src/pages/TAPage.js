import React, { useState, useEffect } from "react";
import TaCodeEditor from "../components/TaCodeEditor.js";
// import http from "../http";
import websocket from "../http/socketController.js";
import api from "../http/apiController.js";

import Logout from "../components/Logout.js";

import Suggestions from "../components/Suggestions";
import Chat from "../components/Chat";
import { CircularProgress, Button } from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSession } from "../redux/actions/userActions";

function TeachingAssistantView(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);
  const [code, setCode] = useState("");
  const session = useSelector((state) => state.userReducer.session);

  const [connecting, setConnecting] = useState(true);

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
    websocket.code_listener((code) => {
      setCode(code);
    });

    websocket.suggestion_listener((suggests) => {
      setSuggestions(suggests);
    });
    websocket.python_listener((output) => {
      setPythonOut(pythonOut + output);
    });
    websocket.chat_listener((chat) => {
      setChatOut(chat);
    });
  }, []);

  if (connecting) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Logout />
      <Link to="/sessions">
        <Button
          variant="filled"
          onClick={() => {
            api.stopSession(session).then((res) => {
              dispatch(setSession(null));
              console.log(res);
              // returnToSessions();
            });
          }}
        >
          Destroy and Leave Session
        </Button>
      </Link>

      <TaCodeEditor
        onCodeChange={(code) => websocket.send_code(code)}
        onExecute={(code) =>
          api.executePython(code).then((res) => {
            console.log(res);
          })
        }
      />
      <Suggestions suggestions={suggestions} />
      <Chat chatOut={chatOut}></Chat>
      <div>
        PYTHON FROM WEBSOCKET
        {pythonOut}
      </div>
    </div>
  );
}

export default TeachingAssistantView;
