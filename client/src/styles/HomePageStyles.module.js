import { makeStyles } from "@material-ui/core/styles";

import Background from '../pictures/background_image.jpg';

let useStyles = makeStyles((theme) => ({
  loginPage: {
    textAlign: "center",
    backgroundColor: "#121212",
    // width: "100%",
    height: "100%",
    justifyContent: "center",
    background: `url(${Background}) no-repeat center center fixed`,
    WebkitBackgroundSize: "cover",
    MozBackgroundSize: "cover",
    OBackgroundSize: "cover",
    backgroundSize: "cover",
  },
  loginForm: {
    alignContent: "center",
    width: "50%",
  },
  loginFormElement: {
    color: "blue",
  },
  signUpElement: {
    color: "white",
    margin: "15px",
  },
}));

export default useStyles;
