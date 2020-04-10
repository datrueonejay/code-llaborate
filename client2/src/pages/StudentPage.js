import React, { useState, useEffect } from "react";
// import Editor from "../containers/Editor.js";
import websocket from "../http/socketController.js";

//import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

// import {
//   Button,
//   // Drawer,
//   AppBar,
//   CssBaseline,
//   TextField,
//   Toolbar,
//   Typography,
//   IconButton,
//   Divider,
//   List,
//   ListItem,
//   CircularProgress,
// } from "@material-ui/core";

import {
  CssBaseline,
  CircularProgress,
} from "@material-ui/core";

// import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Logout from "../components/Logout.js";
import Drawer from "../components/Drawer.js";
import StudentCodeEditor from "../components/StudentCodeEditor.js";
import StudentSuggestion from "../components/StudentSuggestion.js";

import Suggestions from "../components/Suggestions";
import Chat from "../components/Chat";
import {useStyles} from "../styles/StudentPageStyle.js";
// import styles from "../scss/StudentPage.scss";


// credit: https://material-ui.com/components/drawers/

// const drawerWidth = 400;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   appBar: {
//     backgroundColor: "#262626",
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginRight: drawerWidth,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   hide: {
//     display: "none",
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerHeader: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   content: {
//     flexGrow: 1,
//     marginRight: 0,
//   },
//   contentShift: {
//     marginRight: drawerWidth,
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

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
  // const theme = useTheme();

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

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
    websocket.suggestion_listener((suggestion) => {
      setSuggestions((old) => old.concat(suggestion));
    });
    websocket.python_listener((output) => {
      setPythonOut((old) => old.concat(output));
    });
    websocket.chat_listener((message) => {
      setChatOut((old) => old.concat(message));
    });
  }, []);

  if (connecting) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Logout />

      <CssBaseline />
      <Drawer chatOut={chatOut}> </Drawer>
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        {/* <Editor /> */}
        <StudentCodeEditor code={code} />
        <StudentSuggestion
          onSuggest={(lineNum, code) => {
            websocket.send_suggestion(lineNum, code);
          }}
        />
        <Suggestions suggestions={suggestions} />
        <Chat
          chatOut={chatOut}
          sendChat={(message) => websocket.send_chat(message)}
        ></Chat>
        <div>
          PYTHON FROM WEBSOCKET
          {pythonOut}
        </div>
      </main>
    </div>
  );
}
