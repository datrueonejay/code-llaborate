import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "../scss/Home.scss";

function Home(props) {

    return(
        <div  className="logo">
            <Link to="/signup">Sign up!</Link>
            <br></br>
            <Link to="/login">Login</Link>
            <h1 className="welcome">Hello, Welcome To JayJayRay, where the JayJays Ray</h1>
        </div>
    )
}

export default Home;