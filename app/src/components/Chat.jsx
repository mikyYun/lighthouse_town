import { useState, useContext, useEffect } from "react";

import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
import "./Chat.scss";

export default function Chat(props) {
  // const { username, room } = props;
  // const [recipient, setRecipient] = useState("all");
  const {recipient, changeRecipient} = props;

  // useEffect(() => {
  //   console.log("RECIPIENT UPDATED", recipient)
  // }, [recipient])
  // const changeRecipient = (newRecipient) => {
  //   setRecipient((prev) => newRecipient);
  // };
  return (
    <div className="chatroom">
      <Recipient recipient={recipient} changeRecipient={changeRecipient} />
      <ChatRoom recipient={recipient} />
    </div>
  );
}
