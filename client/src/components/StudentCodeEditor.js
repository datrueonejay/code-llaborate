import React, { useRef } from "react";
import useStyles from "../styles/CodeEditorStyles.module";
import { Button } from "@material-ui/core";
import useSharedStyles from "../styles/SharedStyles.module";

import clsx from "clsx";

import AceEditor from "react-ace";

export default function StudentCodeEditor(props) {
  const editorRef = useRef(null);
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  return (
    <div className={clsx(styles.editorContainer, sharedStyles.flexGrow)}>
      <div className={sharedStyles.subTitle}>Code</div>

      <AceEditor
        id="AceEditor1"
        ref={editorRef}
        placeholder="Code Will Appear Here"
        mode="python"
        theme="monokai"
        name="AceEditor1"
        fontSize={14}
        value={props.code}
        width="100%"
        readOnly
      />
      <a
        href={`data:text/plain;charset=utf-8,${props.code}`}
        download="code.py"
        className={clsx(styles.downloadAnchor)}
      >
        <Button variant="contained" color="primary" fullWidth>
          Download Code
        </Button>
      </a>
    </div>
  );
}
