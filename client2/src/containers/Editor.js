import React, { useState, useEffect, useRef } from "react";
import http from "../http";
import "./Editor.css";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";
import Chat from "./Chat2";

import AceEditor from "react-ace";

// Import a Mode (language)
import 'brace/mode/python';

// Import a Theme 
import 'brace/theme/monokai';

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

// let handleSubmitChat = event => {
//   event.preventDefault();
//   let chat = document.querySelector("#chatText").value;
//   http.send_message(chat, "CHAT");
// };

export default function Editor(props) {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);
  const [state, setState] = useState(0);

  let timeout = null;
  const editorRef = useRef(null);

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

  function handleSubmitTextEditor() {

    let code = state.newValue;
  
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

  function onChange(newValue) {

    clearTimeout(timeout);
    let a = newValue;
    timeout = setTimeout(() => {
      http.send_message(a, "CODE");
    }, 500);
    
    console.log('change', newValue);

    // store this value in state!!
    setState({ newValue: newValue});
  }

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
          {/* <Form onSubmit={handleSubmitChat}>
            <textarea
              name="chat"
              className="chatText"
              id="chatText"
            />
            <Button type="submit" className="btn">
              {" "}
              Chat{" "}
            </Button>
          </Form> */}
          {/* <Chat chatOut={chatOut} ></Chat> */}
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
            <AceEditor
              id="AceEditor"
              ref={editorRef}
              placeholder="Start Typing Here!"
              mode="python"
              theme="monokai"
              name="AceEditor"
              // onLoad={this.onLoad}
              onChange={onChange}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={state.newValue}
              setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}/>
            <Button type="submit" className="btn">
              {" "}
              Run{" "}
            </Button>

          </Form>

          <Button className="btn" onClick={handleSubmitTextEditor}>
              {" "}
              Run Editor{" "}
          </Button>

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
