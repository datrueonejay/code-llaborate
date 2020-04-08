import React, { useState, useEffect } from "react";
// import Editor from "../containers/Editor.js";
import websocket from "../http/socketController.js";

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
  CircularProgress,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Logout from "../components/Logout.js";
import StudentCodeEditor from "../components/StudentCodeEditor.js";
import StudentSuggestion from "../components/StudentSuggestion.js";

import Suggestions from "../components/Suggestions";
import Chat from "../components/Chat";

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

  const [connecting, setConnecting] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    websocket.connect(
      () => {
        console.log("Connected successfully!");
        setConnecting(false);
      },
      () => {
        console.log("Could not connect");
      }
    );
    websocket.code_listener((message) => {
      setCode(message);
    });
    websocket.suggestion_listener((suggests) => {
      setSuggestions(suggests);
    });
    websocket.python_listener((output) => {
      setPythonOut(pythonOut + output);
    });
    websocket.chat_listener((chat) => {
      setChatOut(chat);
    });
  }, []);

  if (connecting) {
    return <CircularProgress />;
  }

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
        <StudentSuggestion
          onSuggest={(lineNum, code) => {
            websocket.send_suggestion(lineNum, code);
          }}
        />
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
