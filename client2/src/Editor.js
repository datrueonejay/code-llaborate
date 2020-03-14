import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Http from "./http.js";
import http from "./http";

function App(props) {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  let timeout = null;

  useEffect(() => {
    http.socket_listener(message => {
      setText(message);
    });
  });

    return (
        <div className="App">
        {props.isStudent ?  (
            <div>
            <p>Text below</p>
            <p>{text}</p>
            </div>
        )
        : 
        (
          <textarea
          onChange={e => {
              clearTimeout(timeout);
              let a = e.target.value;
              timeout = setTimeout(() => {
              http.send_message(a);
              }, 500);
          }}
          ></textarea>
      )
        }
        </div>
    );
}

export default App;
