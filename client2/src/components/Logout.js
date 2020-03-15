import React from 'react';
import { setAuth } from "./redux/actions/userActions";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

function Logout() {
  return (
    <button className="logout" onClick={e => dispatch(setAuth(false))}>
      Logout
    </button>
  );
}

