import React from "react";
import { setAuth } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const authentication = require("../http/autheticationController.js");

function Logout() {
  const dispatch = useDispatch();

  function onClick() {
    authentication.signout().then((res) => {
      dispatch(setAuth(false));
    });
  }

  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary" onClick={onClick}>
        Logout!
      </Button>
    </Link>
  );
}

export default Logout;
