import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Route, Redirect } from 'react-router-dom';


// const PrivateRoute = ({ component: Component, auth: auth, ...rest }) => (
//   <Route {...rest} render={props => 
//     auth === true
//     ? (<Component {...props} />)
//     : (<Redirect to="/login" />)
//   } />
// );

function PrivateRoute(props) {
  const authenticated = useSelector(state => state.userReducer.auth);
  const type = useSelector(state => state.userReducer.userType);

  if (props.for) {
    if (type == props.for) {
      return (<props.component />)
    } else {
      return (<Redirect to="/login" />)
    }
  }

  if (authenticated) {
    return (<props.component />)
  } else {
    return (<Redirect to="/login" />)
  }
}

export default PrivateRoute;