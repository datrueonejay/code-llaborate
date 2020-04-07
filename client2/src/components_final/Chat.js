import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import http from "../http";
import Logout from "./Logout.js";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Button,
  Drawer,
  AppBar,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// credit: https://material-ui.com/components/drawers/

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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

export default function StudentView(props) {
  const [courses, setCourses] = useState([]);
  const [isSession, setIsSession] = useState(false);
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    http
      .getSessions()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="sticky"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Persistent drawer
          </Typography>
          <Logout />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div id="drawer_format">
          <div>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>

          <Divider />

          <TextField label="Write a message..."> </TextField>
          <Button> Send </Button>

          <Divider />
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, { [classes.contentShift]: open })}
      ></main>
    </div>
  );
}
