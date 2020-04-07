import React, { useState, useEffect, useRef } from "react";
import http from "../http";
import "./Editor.css";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";
import Chat from "./Chat2";

import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";

import { TYPE_STUDENT } from "../Constants";
import { useSelector } from "react-redux";

// const apiPython = require("../apiPython.js");

// async
// function handleSubmitText(event) {
//   event.preventDefault();
//   let code = document.querySelector('#codeText textarea[name="code"]').value;
//   console.log(`Code is ${code}`);
//   console.log(document.querySelector("#AceEditor").value);
//   apiPython.compileText(code, function (err, res) {
//     if (err) return console.log(err);
//     let outputPython = res.string;
//     let output = document.querySelector("#box");
//     let outputdiv = document.querySelector("#output");

//     output.innerHTML = outputPython;

//     outputdiv.style.visibility = "visible";
//     output.style.visibility = "visible";
//   });
// }

// function handleSubmitFile(event) {
//   event.preventDefault();
//   let file = document.querySelector('#codeFile input[name="file"]').files[0];
//   document.querySelector("#codeFile").reset();
//   apiPython.compileFile(file, function (err, res) {
//     if (err) return console.log(err);
//     let outputPython = res.string;
//     let output = document.querySelector("#box");
//     let outputdiv = document.querySelector("#output");

//     output.innerHTML = outputPython;

//     outputdiv.style.visibility = "visible";
//     output.style.visibility = "visible";
//   });
// }

let handleSubmitSuggestion = (event) => {
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
  // const [state, setState] = useState(0);
  const [code, setCode] = useState("");
  const role = useSelector((state) => state.userReducer.userType);

  let timeout = null;
  const editorRef = useRef(null);

  useEffect(() => {
    http.connect();
    http.code_listener((message) => {
      setText(message);
    });
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

  // function handleSubmitTextEditor() {
  //   let code = state.newValue;

  //   apiPython.compileText(code, function (err, res) {
  //     if (err) return console.log(err);
  //     let outputPython = res.string;
  //     let output = document.querySelector("#box");
  //     let outputdiv = document.querySelector("#output");

  //     output.innerHTML = outputPython;

  //     outputdiv.style.visibility = "visible";
  //     output.style.visibility = "visible";
  //   });
  // }

  function onChange(newValue) {
    clearTimeout(timeout);
    let a = newValue;
    timeout = setTimeout(() => {
      http.send_message(a, "CODE");
    }, 500);

    // console.log("change", newValue);

    // store this value in state!!
    setCode(newValue);
    // setState({ newValue: newValue });
  }

  // https://stackoverflow.com/questions/55830414/how-to-read-text-file-in-react
  let loadFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        let code = ev.target.result;
        console.log(code);
        setCode(code);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="codeText">
      {role === TYPE_STUDENT ? (
        <div>
          <AceEditor
            id="AceEditor"
            ref={editorRef}
            placeholder="Start Typing Here!"
            mode="python"
            theme="monokai"
            name="AceEditor"
            onLoad={text}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={text}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            readOnly
          />

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
          {/* <Form onSubmit={handleSubmitText} id="codeText">
            <textarea
              name="code"
              className="codeText"
              onChange={(e) => {
                clearTimeout(timeout);
                let a = e.target.value;
                timeout = setTimeout(() => {
                  http.send_message(a, "CODE");
                }, 500);
              }}
            ></textarea> */}
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
            value={code}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
          {/* <Button type="submit" className="btn">
            {" "}
            Run{" "}
          </Button> */}
          {/* </Form> */}

          {/* <Button className="btn" onClick={handleSubmitTextEditor}> */}
          <Button
            className="btn"
            onClick={() => {
              http.executePython(code).then((res) => {
                console.log(res);
              });
            }}
          >
            {" "}
            Run Editor{" "}
          </Button>

          {/* <Form onSubmit={handleSubmitFile} id="codeFile"> */}
          <Form
            onSubmit={() => console.log("TODO")}
            onChange={loadFile}
            id="codeFile"
          >
            <input type="file" name="file" accept=".py, .txt" />
            {/* <input type="submit" className="btn" /> */}
          </Form>
          <a href={`data:text/plain;charset=utf-8,${code}`} download="code.py">
            Download Code
          </a>
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
