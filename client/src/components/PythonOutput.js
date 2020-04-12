import React from "react";
import useSharedStyles from "../styles/SharedStyles.module";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/mode-text";


function PythonOutput(props) {
  const sharedStyles = useSharedStyles();

  return (
    <div className={sharedStyles.flexGrow}>
      <div className={sharedStyles.subTitle}>Code Output</div>
      <AceEditor
        id="AceEditor2"
        theme="terminal"
        mode="text"
        name="AceEditor2"
        value={props.pythonOut}
        fontSize={14}
        width="100%"
        readOnly
        highlightActiveLine={false}
        wrapEnabled={true}
        setOptions={{ showLineNumbers: false, showGutter: false }}
      />
    </div>
  );
}

export default PythonOutput;
