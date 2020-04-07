import React, { useState, useEffect, useRef } from "react";
import http from "../http";
import "./Editor.css";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";

import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";

export default function TaCodeEditor(props) {
  const [code, setCode] = useState("");

  const editorRef = useRef(null);

  function onChange(newValue) {
    props.onCodeChange(newValue);
    // http.send_message(newValue, "CODE");
    setCode(newValue);
  }

  // https://stackoverflow.com/questions/55830414/how-to-read-text-file-in-react
  let loadFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        let code = ev.target.result;
        console.log(code);
        props.onCodeChange(code);
        setCode(code);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className="codeText">
      <div className="Editor">
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

        <Button
          className="btn"
          //   onClick={() => {
          //     http.executePython(code).then((res) => {
          //       console.log(res);
          //     });
          //   }}
          onClick={() => {
            props.onExecute(code);
          }}
        >
          {" "}
          Run Editor{" "}
        </Button>

        <Form onChange={loadFile} id="codeFile">
          <input type="file" name="file" accept=".py, .txt" />
        </Form>
        <a href={`data:text/plain;charset=utf-8,${code}`} download="code.py">
          Download Code
        </a>
      </div>
    </div>
  );
}
