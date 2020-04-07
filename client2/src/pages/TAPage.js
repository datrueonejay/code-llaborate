import React, { useState, useEffect } from "react";
import TaCodeEditor from "../components_final/TaCodeEditor.js";
import http from "../http";
import Logout from "../components_final/Logout.js";

import Suggestions from "../components_final/Suggestions";
import Chat from "../components_final/Chat";

function TeachingAssistantView(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);

  useEffect(() => {
    http.connect();
    http.suggestion_listener((suggests) => {
      setSuggestions(suggests);
    });
    http.python_listener((output) => {
      setPythonOut(pythonOut + output);
    });
    http.chat_listener((chat) => {
      setChatOut(chat);
    });
  }, []);

  return (
    <div>
      <Logout />

      <TaCodeEditor
        onCodeChange={(code) => http.send_message(code, "CODE")}
        onExecute={(code) =>
          http.executePython(code).then((res) => {
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
