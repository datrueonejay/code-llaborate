import { makeStyles } from "@material-ui/core/styles";

let useSharedStyles = makeStyles((theme) => ({
  title: {
    color: "#FFFFFF",
    fontSize: "45px",
    textAlign: "center",
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
    backgroundColor: "#121212",
    height: "100%",
  },
  flexGrow: {
    flexGrow: 2,
  },
}));

export default useSharedStyles;
