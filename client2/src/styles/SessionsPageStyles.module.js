import { makeStyles } from "@material-ui/core/styles";

let useStyles = makeStyles((theme) => ({
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
