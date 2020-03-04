import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Http from "./http.js";
import http from "./http";

function App() {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(true);
  let timeout = null;

  useEffect(() => {
    http.socket_listener((message) => {
      setText(message);
    })
  })

  
  return (
    <div className="App">
      <button onClick={() => setWriter(!writer)}>Change account type</button>
      {
        writer ? 
        <textarea onChange={(e) => {
          clearTimeout(timeout);
          let a = e.target.value;
          timeout = setTimeout(() => {
            http.send_message(a);
          }, 500);
        }}></textarea>

        :
        <div>
          <p>Text below</p>
          <p>{text}</p>
        </div>
      }
    </div>
  );
}

export default App;
