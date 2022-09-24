import {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import MessageForm from "./MessageForm";
import Avatar from "./Avatar.jsx";
import Cookies from "universal-cookie";
import { UserListContext } from "../App.js";
// import { UserListContext, MsgContext } from "../App.js";

function ChatRoom(props) {
  const { room, message } = useContext(UserListContext);
  const cookies = new Cookies().getAll();
  const userCookie = cookies.userdata;
  const username = userCookie?.userName;
  const [messageHistory, setMessageHistory] = useState([]);
  const { recipient } = props;
  const chatWindow = useRef();

  useEffect(() => {
    if (!messageHistory[0]?.username) {
      setMessageHistory([message])
    } else {
      setMessageHistory((prev) => [...prev, message]);
    }
    moveScrollToReceiveMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  
  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  
  // useEffect(() => {
  //   console.log("MESSAGE UPDATE", messageHistory)
  // }, [messageHistory])

  const createMessage = 
    // if (messageHistory.length > 0) {
       messageHistory.map((msgContent, index) => {
        const privateOrPublic = msgContent?.type === "PRIVATE" ? "private" : "public"
        if (msgContent?.username) {
          return (
            <div
              className="d-flex flex-row chat-content"
              key={msgContent.sender + msgContent.username + index}
            >
              <div className={`message-nickname ${privateOrPublic}`}>
                <Avatar url={msgContent.avatar} />
                <span className="sender">{msgContent.sender}</span>
                to
                <span className="recipient">{msgContent.recipient}</span>:
                <span className="content">{msgContent.content}</span>
                <span className="time">
                  {msgContent.time}
                </span>
              </div>
            </div>
          );
        } else {return null}
      });
    // }

  return (
    <div className="d-flex flex-column chat-form">
      <div id="greeting-box">
        <span className="username">{username}</span>
        joined in
        <span className="room">{room}</span>
        room.
      </div>
      <div className="chat-window card" ref={chatWindow}>
        {createMessage}
        {/* BOTTOM SPACE */}
        <div className="d-flex flex-row chat-content" ></div>
      </div>
      <MessageForm username={username} recipient={recipient} user={username} />

    </div>
  );
}

export default ChatRoom;
