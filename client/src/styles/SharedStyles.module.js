import { makeStyles } from "@material-ui/core/styles";

import Background from "../pictures/background_image.jpg";

let useSharedStyles = makeStyles((theme) => ({
  title: {
    color: "#FFFFFF",
    fontSize: "45px",
    textAlign: "center",
    marginBottom: "20px",
  },
  subTitle: {
    color: "#FFFFFF",
    fontSize: "20px",
    padding: 10,
  },
  fullwidth: {
    width: "100%",
  },
  errorText: {
    color: "#CF6679",
  },
  background: {
    background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${Background}) no-repeat center center fixed`,
    WebkitBackgroundSize: "cover",
    MozBackgroundSize: "cover",
    OBackgroundSize: "cover",
    backgroundSize: "cover",
    height: "100%",
  },
  flexGrow: {
    flexGrow: 2,
  },
  hideOverflowY: {
    overflowY: "hidden",
  },
  sessionEditorDiv: {
    width: "50%",
    paddingRight: 35,
  },
  sessionSuggestionDiv: {
    width: "50%",
    paddingLeft: 35,
  },
  leaveSession: {
    margin: 10,
  },
}));

export default useSharedStyles;
