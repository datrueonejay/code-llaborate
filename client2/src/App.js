import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
// import Http from "./http.js";
// import http from "./http";
import Login from "./containers/Login.js";
import Signup from "./containers/Signup.js";
import Editor from "./containers/Editor.js";
import { setAuth } from "./redux/actions/userActions";
import SelectCourse from "./containers/SelectCourse";

function App() {
  const [text, setText] = useState("");
  const [writer, setWriter] = useState(false);
  // const [authenticate, setAuthenticate] = useState(false);
  let timeout = null;

  const authenticate = useSelector(state => state.userReducer.auth);
  const type = useSelector(state => state.userReducer.userType);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   http.socket_listener(message => {
  //     setText(message);
  //   });
  // });

  // function loginStatus(newValue) {
  //   seAuth(newValue);
  // }

  function Logout() {
    return (
      <button className="logout" onClick={e => dispatch(setAuth(false))}>
        Logout
      </button>
    );
  }

  if (authenticate) {
    console.log(type);
    let isStudent = type === "STUDENT";
    return (
      <div className="App">
        <div>
          <SelectCourse isStudent={isStudent} />
        </div>
      </div>
    );
    // return (
    //   <div className="App">
    //     <div>
    //       {" "}
    //       <Editor isStudent={isStudent} />{" "}
    //     </div>
    //     <div>
    //       {" "}
    //       <Logout />{" "}
    //     </div>
    //   </div>
    // );
  } else {
    // authenticate = false
    return (
      <div className="App">
        <div>
          {" "}
          <Signup />{" "}
        </div>
        <div>
          {" "}
          <Login />{" "}
        </div>
      </div>
    );
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
