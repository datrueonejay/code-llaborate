import { makeStyles } from "@material-ui/core/styles";

let sharedStyles = makeStyles((theme) => ({
  title: {
    color: "#FFFFFF",
    fontSize: "45px",
    textAlign: "center",
  },
  fullwidth: {
    width: "100%",
  },
  errorText: {
    color: "#CF6679",
  },
  background: {
    backgroundColor: "#121212",
    height: "100%",
  },
}));

export default sharedStyles;
