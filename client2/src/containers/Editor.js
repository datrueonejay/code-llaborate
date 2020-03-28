import React, { useState, useEffect } from "react";
import http from "../http";
import "./Editor.css";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";
import Chat from "./Chat2";

const apiPython = require("../apiPython.js");

// async
function handleSubmitText(event) {
  event.preventDefault();
  let code = document.querySelector('#codeText textarea[name="code"]').value;
  apiPython.compileText(code, function(err, res) {
    if (err) return console.log(err);
    let outputPython = res.string;
    let output = document.querySelector("#box");
    let outputdiv = document.querySelector("#output");

    output.innerHTML = outputPython;

    outputdiv.style.visibility = "visible";
    output.style.visibility = "visible";
  });
}

function handleSubmitFile(event) {
  event.preventDefault();
  let file = document.querySelector('#codeFile input[name="file"]').files[0];
  document.querySelector("#codeFile").reset();
  apiPython.compileFile(file, function(err, res) {
    if (err) return console.log(err);
    let outputPython = res.string;
    let output = document.querySelector("#box");
    let outputdiv = document.querySelector("#output");

    output.innerHTML = outputPython;

    outputdiv.style.visibility = "visible";
    output.style.visibility = "visible";
  });
}

let handleSubmitSuggestion = event => {
  event.preventDefault();
  let suggestion = document.querySelector("#suggestionText").value;
  http.send_message(suggestion, "SUGGESTION");
};

let handleSubmitChat = event => {
  event.preventDefault();
  let chat = document.querySelector("#chatText").value;
  http.send_message(chat, "CHAT");
};

export default function Editor(props) {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);
  let timeout = null;

  useEffect(() => {
    http.connect();
    http.code_listener(message => {
      setText(message);
    });
    http.suggestion_listener(suggests => {
      setSuggestions(suggests);
    });
    http.python_listener(output => {
      setPythonOut(pythonOut + output);
    });
    http.chat_listener(chat => {
      setChatOut(chat);
    });
  }, []);

  return (
    <div className="codeText">
      {props.isStudent ? (
        <div>
          <div>
            <p>Text below</p>
            <p>{text}</p>
          </div>
          <Form onSubmit={handleSubmitSuggestion}>
            <textarea
              name="suggestion"
              className="suggestionText"
              id="suggestionText"
            />
            <Button type="submit" className="btn">
              {" "}
              Suggest{" "}
            </Button>
          </Form>
          <Suggestions suggestions={suggestions} />
          <Form onSubmit={handleSubmitChat}>
            <textarea
              name="chat"
              className="chatText"
              id="chatText"
            />
            <Button type="submit" className="btn">
              {" "}
              Chat{" "}
            </Button>
          </Form>
          <Chat chatOut={chatOut} ></Chat>
          <div>
            PYTHON FROM WEBSOCKET
            {pythonOut}
          </div>
        </div>
      ) : (
        <div className="Editor">
          <Form onSubmit={handleSubmitText} id="codeText">
            <textarea
              name="code"
              className="codeText"
              onChange={e => {
                clearTimeout(timeout);
                let a = e.target.value;
                timeout = setTimeout(() => {
                  http.send_message(a, "CODE");
                }, 500);
              }}
            ></textarea>
            <Button type="submit" className="btn">
              {" "}
              Run{" "}
            </Button>
          </Form>

          <Form onSubmit={handleSubmitFile} id="codeFile">
            <input type="file" name="file" accept=".py, .txt" />
            <input type="submit" className="btn" />
          </Form>

          <div id="output">
            <span id="box"> </span>
          </div>
          <Suggestions suggestions={suggestions} />
          <Chat chatOut={chatOut}></Chat>
          <div>
            PYTHON FROM WEBSOCKET
            {pythonOut}
          </div>
        </div>
      )}
    </div>
  );
}
