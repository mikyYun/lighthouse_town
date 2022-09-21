import { useState } from "react";
import ChatRoom from "./ChatRoom";

import Recipient from "./Recipient";
export default function Chat(props) {
  const [recipient, setRecipient] = useState({ value: "all", label: "all" });

  return (
    <div className="d-flex flex-column chatroom">
      <Recipient
        nickname={props.username}
        recipient={recipient}
        setRecipient={setRecipient}
      />
      <ChatRoom
        nickname={props.username}
        room={props.room}
        recipient={recipient}
      />
    </div>
  );
}
