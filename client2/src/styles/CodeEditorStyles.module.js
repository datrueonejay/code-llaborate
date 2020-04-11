import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  bodyContainer: {
    display: "flex",
  },
  editorContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-evenly",
  },
  downloadAnchor: {
    textDecoration: "none",
  },
  fileButtonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  fileButtons: {
    width: "48%",
  },
  studentSuggestion: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default useStyles;
