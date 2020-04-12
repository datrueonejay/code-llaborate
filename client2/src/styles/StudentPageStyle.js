import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 400;

export const useStyles = makeStyles((theme) => ({

  root: {
    display: "flex",
  },
  appBar: {
    backgroundColor: "#262626",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    marginRight: 0,
  },
  contentShift: {
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },

}));