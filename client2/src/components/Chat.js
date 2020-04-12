import React from "react";
// import http from "../http";
import { Form } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";

function Chat(props) {
  let handleSubmitChat = (event) => {
    event.preventDefault();
    props.sendChat(document.querySelector("#chatText").value);
  };

  // TODO: Fill in username/possibly time?

  let Chat = ({ index, style }) => {
    return (
      <div style={style}>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textPrimary">Anonymous</Typography>
            <Typography color="textSecondary">
              {props.chatOut[index]}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <Typography align="center" variant="h4" color="textPrimary">
        Chat
      </Typography>
      {/* <div className={sharedStyles.subTitle}>Chat</div> */}
      <List
        height={props.height || 400}
        itemSize={150}
        itemCount={props.chatOut.length}
        width="100%"
      >
        {Chat}
      </List>
      {/* <nav className="listMessage">
        <ul>
          {props.chatOut.map((chat, index) => {
            return (
              <li key={index} id={chat}>
                {chat}
              </li>
            );
          })}
        </ul>
      </nav> */}
      <Form onSubmit={handleSubmitChat}>
        <div>
          <TextField
            label="Send a message..."
            name="chat"
            className="chatText"
            id="chatText"
          ></TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Message
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Chat;
