import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Http from "./http.js";
import http from "./http";
import Login from "./containers/Login.js";
import Signup from "./containers/Signup.js";
import Editor from "./Editor.js";

function App() {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  const [authenticate, setAuthenticate] = useState(false);
  let timeout = null;

  useEffect(() => {
    http.socket_listener(message => {
      setText(message);
    });
  });

  function loginStatus(newValue) {
    setAuthenticate(newValue);
  }

  function Logout() {
    return (
      <button className="logout" onClick={e => setAuthenticate(false)}>
        Logout
      </button>
    );
  }

  if (authenticate) {
    return  (<div className="App">
              <div> <Editor /> </div>
              <div> <Logout/> </div>
             </div>
            )
  } 
    else { // authenticate = false
      return (<div className="App">
              <div> <Signup auth={authenticate} onChange={loginStatus} /> </div>
              <div> <Login auth={authenticate} onChange={loginStatus} /> </div>
              </div>
            )
  }

  // return (
  //   <div className="App">
  //    <Signup />
  //    <Login />
  //     <button onClick={() => setWriter(!writer)}>Change account type</button>
  //     {writer ? (
  //       <textarea
  //         onChange={e => {
  //           clearTimeout(timeout);
  //           let a = e.target.value;
  //           timeout = setTimeout(() => {
  //             http.send_message(a);
  //           }, 500);
  //         }}
  //       ></textarea>
  //     ) : (
  //       <div>
  //         <p>Text below</p>
  //         <p>{text}</p>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default App;
