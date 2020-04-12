import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
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
    overflowY: "scroll",
    maxHeight: "50vh"
  },
  //.list
  listClass: {},
  //.center
  centerClass: {
    margin: "0 auto",
    textAlign: "center",
    alignItems: "center",
  },

  colorWhiteClass: {
    color: "white"
  },

  inlineBlock: {
    display: "inline-block"
  },

  hide: {
    position: "absolute !important",
    top: "-6980px !important",
    left: "-6980px !important",
  },

  arrow: {
    fontSize: "50px",
    userSelect: "none",
    cursor: "pointer"
  }
}));

export default useStyles;
