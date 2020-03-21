import React from 'react';
import { setAuth } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Logout.css";


function Logout() {
  const dispatch = useDispatch();

  return (
    <div className="logout"> 
      <Link to="/" onClick={e => dispatch(setAuth(false))} > Logout! </Link>
    </div>

  );
}

export default Logout

