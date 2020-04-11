import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
  loginPage: {
    textAlign: "center",
    backgroundColor: "#121212",
    // width: "100%",
    height: "100%",
  },
  loginForm: {
    alignContent: "center",
    width: "50%",
  },
  loginFormElement: {
    color: "blue",
  },
  signUpElement: {
    // color: "red",
    margin: "15px",
  },
}));

export default useStyles;
