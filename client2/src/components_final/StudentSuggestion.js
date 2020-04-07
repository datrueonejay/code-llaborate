import React, { useState, useEffect, useRef } from "react";
import http from "../http";
import "./Editor.css";

import { TextField } from "@material-ui/core";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";

import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";

export default function StudentSuggestion(props) {
  const [code, setCode] = useState("");
  const [lineNum, setLineNum] = useState(0);

  const editorRef = useRef(null);

  function onChange(newValue) {
    setCode(newValue);
  }

  return (
    <div className="codeText">
      <div className="Editor">
        <AceEditor
          id="AceEditor"
          ref={editorRef}
          placeholder="Suggest Here!"
          mode="python"
          theme="monokai"
          name="AceEditor"
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
        <TextField
          id="lineNum"
          label="Line Number for Suggestion"
          type="number"
          onChange={(e) => setLineNum(e.target.value)}
        />
        <Button
          className="btn"
          //   onClick={() => {
          //     http.executePython(code).then((res) => {
          //       console.log(res);
          //     });
          //   }}
          onClick={() => {
            props.onSuggest(lineNum, code);
          }}
        >
          Suggest Code
        </Button>
      </div>
    </div>
  );
}
