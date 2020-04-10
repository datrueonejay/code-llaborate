import React, { useState, useEffect, useRef } from "react";
import "./Editor.css";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";

import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";

export default function TaCodeEditor(props) {
  // const [code, setCode] = useState(props.code);

  const editorRef = useRef(null);

  function onChange(newValue) {
    props.onCodeChange(newValue);
    // setCode(newValue);
  }

  // https://stackoverflow.com/questions/55830414/how-to-read-text-file-in-react
  let loadFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        let code = ev.target.result;
        props.onReadFile(code);
        onChange(code);
        // props.onCodeChange(code);
        // setCode(code);
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
          value={props.code}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
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
          onClick={() => {
            props.onExecute(props.code);
          }}
        >
          {" "}
          Run Editor{" "}
        </Button>

        <Form onChange={loadFile} id="codeFile">
          <input type="file" name="file" accept=".py, .txt" />
        </Form>
        <a
          href={`data:text/plain;charset=utf-8,${props.code}`}
          download="code.py"
        >
          Download Code
        </a>
      </div>
    </div>
  );
}
