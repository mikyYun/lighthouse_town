import { useState, useContext, useEffect } from "react";

import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
import Logout from "./Logout";
import "./Chat.scss";

export default function Chat(props) {
  const {recipient, changeRecipient} = props;

  return (
    <div className="chatroom">
      <Recipient recipient={recipient} changeRecipient={changeRecipient} />
      <Logout />
      <ChatRoom recipient={recipient} />
    </div>
  );
}
