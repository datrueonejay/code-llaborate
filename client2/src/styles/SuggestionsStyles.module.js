import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
  test: {
    backgroundColor: "red",
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  bodyContainer: {
    display: "flex",
  },
  suggestionText: {
    color: "white",
  },
}));

export default useStyles;
