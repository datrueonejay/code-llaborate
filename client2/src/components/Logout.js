import React from "react";
import { setAuth } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Logout.css";

const authentication = require("../http/autheticationController.js");

function Logout() {
  const dispatch = useDispatch();

  function onClick() {
    authentication.signout().then((res) => {
      dispatch(setAuth(false));
    });
    // authentication.signout(function (err, res) {
    //   dispatch(setAuth(false));
    //   console.log(res);
    // });
  }

  return (
    <div className="logout">
      <Link to="/" onClick={(e) => onClick()}>
        {" "}
        Logout!{" "}
      </Link>
    </div>
  );
}

export default Logout;
