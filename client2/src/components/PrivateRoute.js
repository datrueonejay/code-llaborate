import React from "react";
import { useSelector } from "react-redux";

import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

function PrivateRoute(props) {
  const authenticated = useSelector((state) => state.userReducer.auth);
  const type = useSelector((state) => state.userReducer.userType);

  if (props.for) {
    if (type === props.for) {
      return <Route component={props.component} {...props} />;
    } else {
      return <Redirect to="/404NotFound" />;
    }
  }

  if (authenticated) {
    return <Route component={props.component} {...props} />;
  } else {
    return <Redirect to="/401NotAuthenticated" />;
  }
}

export default PrivateRoute;
