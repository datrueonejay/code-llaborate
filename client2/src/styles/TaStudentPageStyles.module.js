import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  bodyContainer: {
    display: "flex",
    justifyContent: "center",
  },
  studentSuggestionContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default useStyles;
