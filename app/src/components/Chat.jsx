import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
import './Chat.scss'

export default function Chat(props) {

  return (

    <>
      <div className="chatroom">
        <Recipient />
        <ChatRoom username={props.username} room={props.room} recipient={''} />
      </div>
    </>
  )
}