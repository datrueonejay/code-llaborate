import React, { useState, useEffect, useRef } from "react";
import http from "../http";
import "./Editor.css";

import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";

export default function StudentCodeEditor(props) {
  // const [code, setCode] = useState("");

  const editorRef = useRef(null);

  // function onChange(newValue) {
  //   setCode(newValue);
  // }

  return (
    <div className="codeText">
      <div className="Editor">
        <AceEditor
          id="AceEditor"
          ref={editorRef}
          placeholder="Code Will Appear Here"
          mode="python"
          theme="monokai"
          name="AceEditor"
          // onChange={onChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={props.code}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
          readOnly
        />
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
