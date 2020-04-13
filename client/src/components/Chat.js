import React from "react";
import { Form } from "react-bootstrap";
import { FixedSizeList as List } from "react-window";

import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";

let getTime = (utcDateString) => {
  let date = new Date(utcDateString);
  let hours = date.getHours();
  let ending = "AM";
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
    ending = "PM";
  }
  let minutes = date.getMinutes();
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ending}`;
};

function Chat(props) {
  const listRef = React.createRef();

  let handleSubmitChat = (event) => {
    event.preventDefault();
    props.sendChat(document.querySelector("#chatText").value);
    listRef.current.scrollToItem(props.chatOut.length + 1);
  };

  let Chat = ({ index, style }) => {
    let { message, time, user } = props.chatOut[index];
    return (
      <div style={style}>
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary">
              {user} at {getTime(time)}
            </Typography>
            <Typography color="textPrimary">{message}</Typography>
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
      <List
        ref={listRef}
        height={props.height || 400}
        itemSize={150}
        itemCount={props.chatOut.length}
        width="100%"
      >
        {Chat}
      </List>
      <Form onSubmit={handleSubmitChat}>
        <div>
          <TextField
            label="Send a message..."
            name="chat"
            className="chatText"
            id="chatText"
            fullWidth
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
