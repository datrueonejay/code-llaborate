import React from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

function Chat(props) {
  
  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {props.chatOut.map(chat => {
          return (
            <li key={chat} id={chat}>
              {chat}
              <CopyToClipboard text={chat}>
                <button>Copy</button>
              </CopyToClipboard>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Chat;
