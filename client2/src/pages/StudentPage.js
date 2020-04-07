import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import http from "../http";

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
import Logout from "../components_final/Logout.js";
import StudentCodeEditor from "../components_final/StudentCodeEditor.js";

import Suggestions from "../components_final/Suggestions";
import Chat from "../components_final/Chat";

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
  // const [courses, setCourses] = useState([]);
  // const [isSession, setIsSession] = useState(false);
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pythonOut, setPythonOut] = useState("");
  const [chatOut, setChatOut] = useState([]);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    http.connect();
    http.code_listener((message) => {
      setCode(message);
    });
    http.suggestion_listener((suggests) => {
      setSuggestions(suggests);
    });
    http.python_listener((output) => {
      setPythonOut(pythonOut + output);
    });
    http.chat_listener((chat) => {
      setChatOut(chat);
    });
  }, []);

  return (
    <div>
      <Logout />

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
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        {/* <Editor /> */}
        <StudentCodeEditor code={code} />
        <Suggestions suggestions={suggestions} />
        <Chat chatOut={chatOut}></Chat>
        <div>
          PYTHON FROM WEBSOCKET
          {pythonOut}
        </div>
      </main>
    </div>
  );
}
