import React, { useRef } from "react";

import { Button } from "@material-ui/core";

import AceEditor from "react-ace";
import useStyles from "../styles/CodeEditorStyles.module";
import useSharedStyles from "../styles/SharedStyles.module";

import clsx from "clsx";

/**Credits: AceEditor http://securingsincity.github.io/react-ace/ */


export default function TaCodeEditor(props) {
  // Credits: Snippet taken from https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input

  const editorRef = useRef(null);
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  function onChange(newValue) {
    props.onCodeChange(newValue);
  }

  // Credits: Snippet inspired by: https://stackoverflow.com/questions/55830414/how-to-read-text-file-in-react
  let loadFile = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        let code = ev.target.result;
        props.onReadFile(code);
        onChange(code);
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  return (
    <div className={clsx(styles.editorContainer, sharedStyles.flexGrow)}>
      <div className={sharedStyles.subTitle}>Code Editor</div>
      <AceEditor
        id="AceEditor"
        ref={editorRef}
        placeholder="Start Typing Here!"
        mode="python"
        theme="monokai"
        name="AceEditor"
        onChange={onChange}
        value={props.code}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        width="100%"
      />
      <Button
        className={styles.runEditorButton}
        onClick={() => {
          props.onExecute(props.code);
        }}
        color="primary"
        variant="contained"
      >
        Run Editor
      </Button>
      <div className={styles.fileButtonsContainer}>
        <form onChange={loadFile} id="codeFile" className={styles.fileButtons}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth
          >
            Load File
            <input
              type="file"
              name="file"
              accept=".py, .txt"
              style={{ display: "none" }}
            />
          </Button>
        </form>

        <a
          href={`data:text/plain;charset=utf-8,${props.code}`}
          download="code.py"
          className={clsx(styles.fileButtons, styles.downloadAnchor)}
        >
          <Button variant="contained" color="primary" fullWidth>
            Download Code
          </Button>
        </a>
      </div>
    </div>
  );
}
