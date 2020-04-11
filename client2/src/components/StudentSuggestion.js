import React, { useState, useEffect, useRef } from "react";

import { TextField } from "@material-ui/core";

import Suggestions from "./Suggestions";

import { Button } from "@material-ui/core";
import AceEditor from "react-ace";

// Import a Mode (language)
import "brace/mode/python";

// Import a Theme
import "brace/theme/monokai";
import useStyles from "../styles/CodeEditorStyles.module";

export default function StudentSuggestion(props) {
  const [code, setCode] = useState("");
  const [lineNum, setLineNum] = useState(0);

  const editorRef = useRef(null);

  const styles = useStyles();

  function onChange(newValue) {
    setCode(newValue);
  }

  return (
    <div className={styles.studentSuggestion}>
      <AceEditor
        id="AceEditor2"
        ref={editorRef}
        placeholder="Suggest Here!"
        mode="python"
        theme="monokai"
        name="AceEditor2"
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
        height="250px"
        width="100%"
      />
      <TextField
        id="lineNum"
        label="Line Number for Suggestion"
        type="number"
        onChange={(e) => setLineNum(e.target.value)}
      />
      <Button
        onClick={() => {
          props.onSuggest(lineNum, code);
        }}
        color="primary"
        variant="contained"
      >
        Suggest Code
      </Button>
    </div>
  );
}
