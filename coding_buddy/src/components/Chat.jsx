import { useState } from "react";
import ChatRoom from "./ChatRoom";

import Recipient from "./Recipient";
export default function Chat(props) {
  const [recipient, setRecipient] = useState(null)
  console.log("IN CHAT", recipient)
  return (
    // <SocketContext.Provider value={socket} users={nickname}>
    // should be in the top in component tree. app.js
    // every component underneath Chat.jsx will be able to access this contexts.
    <>
      <div className="d-flex flex-column chatroom">
        <Recipient nickname={props.username} recipient={recipient} setRecipient={setRecipient}/>
        <ChatRoom nickname={props.username} room={props.room} recipient={recipient}/>
      </div>
      {/* // </SocketContext.Provider> */}
    </>
  )
}