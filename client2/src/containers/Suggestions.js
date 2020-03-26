import React from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function Suggestions(props) {
  return (
    <div>
      <h1>Student Suggestions</h1>
      <ul>
        {props.suggestions.map(suggestion => {
          return (
            <li key={suggestion} id={suggestion}>
              {suggestion}
              <CopyToClipboard text={suggestion}>
                <button>Copy</button>
              </CopyToClipboard>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Suggestions;
