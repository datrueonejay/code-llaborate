import React from "react";
import { setAuth } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/LogoutStyles.module";

const authentication = require("../http/autheticationController.js");

function Logout() {
  const dispatch = useDispatch();
  const styles = useStyles();

  function onClick() {
    authentication.signout().then((res) => {
      dispatch(setAuth(false));
    });
  }

  return (
    <div className={styles.logoutClass}>
      <Link
        className={styles.logoutLinkClass}
        to="/"
        onClick={(e) => onClick()}
      >
        {" "}
        Logout!{" "}
      </Link>
    </div>
  );
}

export default Logout;
