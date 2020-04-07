import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { List } from "@material-ui/core";

function Suggestions(props) {
  return (
    <div>
      <h1>Student Suggestions</h1>
      <List>
        {props.suggestions.map((items) => {
          let { lineNum, suggestion } = items;
          return (
            <li key={suggestion} id={suggestion}>
              {suggestion} for line {lineNum}
              <CopyToClipboard text={suggestion}>
                <button>Copy</button>
              </CopyToClipboard>
            </li>
          );
        })}
      </List>
    </div>
  );
}

export default Suggestions;
