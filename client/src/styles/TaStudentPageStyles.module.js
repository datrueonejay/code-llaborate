import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 10,
  },
  bodyContainer: {
    display: "flex",
    justifyContent: "center",
    padding: 10,
    alignItems: "flex-end",
  },
  studentSuggestionContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default useStyles;
