import { useState, useContext, useEffect } from "react";

import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
import "./Chat.scss";

export default function Chat(props) {
  // const { username, room } = props;
  const [recipient, setRecipient] = useState("");

  // useEffect(() => {
  //   console.log("RECIPIENT UPDATED", recipient)
  // }, [recipient])
  const changeRecipient = (newRecipient) => {
    setRecipient((prev) => newRecipient);
  };
  return (
    <div className="chatroom">
      <Recipient changeRecipient={changeRecipient} />
      <ChatRoom recipient={recipient} />
    </div>
  );
}
