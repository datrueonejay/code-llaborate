import React from 'react';
import { setAuth, purge } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Logout.css";

const api = require('../api.js');

function Logout() {
  const dispatch = useDispatch();

  function onClick () {
    api.signoutUser(function(err, res){
      dispatch(purge());
      console.log(res);
    });
  }

  return (
    <div className="logout"> 
      <Link to="/" onClick={e => onClick()} > Logout! </Link>
    </div>

  );
}

export default Logout

