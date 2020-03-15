import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../App.css";

function Home(props) {

    return(
        <div>
            <h1>Hello, Welcome To JayJayRay, where the JayJays Ray</h1>
            <Link to="/signup">Sign up!</Link>
            <br></br>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default Home;