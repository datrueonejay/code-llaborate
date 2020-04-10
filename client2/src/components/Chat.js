import React from "react";
// import http from "../http";
import { Button, Form } from "react-bootstrap";

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
  );
}

export default Chat;
