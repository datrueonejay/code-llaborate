import { makeStyles, useTheme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  //.form
  formClass: {
    textAlign: "center",
  },
  //.input
  inputClass: {
    width: "50%",
    textAlign: "center",
  },
  //.form-input
  formInputClass: {
    width: "50%",
    margin: "auto",
  },
  //.notification
  notificationClass: {
    textAlign: "center",
    color: "red",
  },
  //.list-wrapper
  listWrapperClass: {
    textAlign: "center",
  },
  //.list
  listClass: {},
  //.center
  centerClass: {
    margin: "0 auto",
    textAlign: "center",
    alignItems: "center",
  },
  //.students
  studentsClass: {
    border: "black solid 3px",
    background: "#121212",
  },
}));
