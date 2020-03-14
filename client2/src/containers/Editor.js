import React, { useState, useEffect } from "react";
import Http from "../http.js";
import http from "../http";
import "./Editor.css";


export default function Editor(props) {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  let timeout = null;

  useEffect(() => {
    http.socket_listener(message => {
      setText(message);
    });
  });

    return (
        <div className="codeText">
        {props.isStudent ?  (
            <div>
            <p>Text below</p>
            <p>{text}</p>
            </div>
        )
        : 
        (
          <textarea className="codeText"
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