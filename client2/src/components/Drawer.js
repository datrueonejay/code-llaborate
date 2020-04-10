import React, { useState, useEffect } from "react";

import { Form } from "react-bootstrap";

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

import {useStyles} from "../styles/StudentPageStyle.js";
import {useTheme} from "@material-ui/core/styles";

import Logout from "../components/Logout.js";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

let handleSubmitChat = (event) => {
    event.preventDefault();
    let chat = document.querySelector("#chatText").value;
    // http.send_message(chat, "CHAT");
  };

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
            <p> Chat </p>
        </div>

        <div>
        <h1>Chat</h1>
        <ul>
            {props.chatOut.map((chat) => {
            return (
                <li key={chat} id={chat}>
                {chat}
                </li>
            );
            })}
        </ul>
        <Form onSubmit={handleSubmitChat}>
            <textarea name="chat" className="chatText" id="chatText" />
            <Button type="submit" className="btn">
            {" "}
            Chat{" "}
            </Button>
        </Form>
        </div>

        <Divider />

        <TextField label="Write a message..."> </TextField>
        <Button> Send </Button>

        <Divider />
        </div>
        </Drawer>
    </div>
    )}