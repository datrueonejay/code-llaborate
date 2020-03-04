import React, { useState, useEffect } from "react";
import ws from "./ws";

function Chat() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.socket_listener((message) => {
      console.log(message);
      setMessages(message);
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    ws.send_message(formData.get("message"));
  }

  return(
    <div className="Chat">
      <div>{messages.map((msg, index) => {
        return <li key={index}>{msg.content}</li>
      })}</div> 
      <form onSubmit={handleSubmit}>
        <textarea name="message" rows="4" cols="50" defaultValue="Work"></textarea>
        <input type="submit"></input>
      </form>
    </div>
  );
}

export default Chat;
