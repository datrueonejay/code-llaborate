import React from "react";
import http from "../http";

function Suggestions(props) {
  return (
    <div>
      <h1>Student Suggestions</h1>
      <ul>
        {props.suggestions.map(suggestion => {
          return (
            <li key={suggestion} id={suggestion}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Suggestions;
