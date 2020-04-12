import React, { useState } from "react";

import Chat from "../components/Chat";
import websocket from "../http/socketController.js";

import clsx from "clsx";
import {
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";

import { useStyles } from "../styles/StudentPageStyle.js";
import { useTheme } from "@material-ui/core/styles";

import Logout from "../components/Logout.js";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";


export default function StudentView(props) {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar
        position="sticky"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            Code-llaborate
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

          <Chat
            chatOut={props.chatOut}
            sendChat={(message) => {
              console.log(message);
              websocket.send_chat(message);
            }}
          ></Chat>

          <Divider />
        </div>
      </Drawer>
    </div>
  );
}
