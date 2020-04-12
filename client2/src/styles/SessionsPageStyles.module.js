import { makeStyles } from "@material-ui/core/styles";
import Background from '../pictures/background_image.jpg';


let useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#121212",
    background: `url(${Background}) no-repeat center center fixed`,
    height: "100%",
    WebkitBackgroundSize: "cover",
    MozBackgroundSize: "cover",
    OBackgroundSize: "cover",
    backgroundSize: "cover",
  },
  sessionText: {
    color: "white",
  },
  joinCourseContainer: {
    width: "50%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },
}));

export default useStyles;
