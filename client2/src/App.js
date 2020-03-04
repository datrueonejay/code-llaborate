import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Http from "./http.js";
import http from "./http";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <p onClick={() => http.socket()}>Socket request</p>
      {/* <p onClick={() => setCount(count + 1)}>Count is {count}</p> */}
      <p onClick={() => http.get()}>Get req</p>
    </div>
  );
}

export default App;
