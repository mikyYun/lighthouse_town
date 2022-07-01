import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
import './Chat.scss'

export default function Chat(props) {
  const {username, room} = props

  return (

    <>
      <div className="chatroom">
        <Recipient />
        <ChatRoom username={username}/>
      </div>
    </>
  )
}