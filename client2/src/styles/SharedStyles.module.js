import { makeStyles } from "@material-ui/core/styles";

import Background from '../pictures/background_image.jpg';

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
  },
  fullwidth: {
    width: "100%",
  },
  errorText: {
    color: "#CF6679",
  },
  background: {
    background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${Background})`,
    // backgroundImage: `url(${Background})`,
    backgroundSize: "cover",
    backgroundColor: "#121212",
    height: "100%",
  },
  flexGrow: {
    flexGrow: 2,
  },
  hideOverflowY: {
    overflowY: "hidden",
  },
}));

export default useSharedStyles;
