import React from "react";
// import http from "../http";
import { Form } from "react-bootstrap";
import  "../scss/Chat.scss"

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

function Chat(props) {
  let handleSubmitChat = (event) => {
    event.preventDefault();
    props.sendChat(document.querySelector("#chatText").value);
    // let chat = document.querySelector("#chatText").value;
    // http.send_message(chat, "CHAT");
  };

  return (
    <div>
      <h1>Chat</h1>
      <nav className="listMessage">

      <ul>
        {props.chatOut.map((chat, index) => {
          return (
            <li key={index} id={chat}>
              {chat}
            </li>
          );
        })}
      </ul>

      </nav>
      <Form onSubmit={handleSubmitChat}>
        <div>
        <TextField label="Send a message..." name="chat" className="chatText" id="chatText" > </TextField>
        <Button type="submit" className="btn">
          {" "}
          Chat{" "}
        </Button>
        </div>
      </Form>
    </div>
  );
}

export default Chat;
