import {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
  createContext,
} from "react";
import MessageForm from "./MessageForm";
import Avatar from "./Avatar.jsx";
import Cookies from "universal-cookie";
import {
  SOCKET_EVENT,
  makePublicMessage,
  makePrivateMessage,
} from "./socket/socket";
import { SocketContext, UserListContext } from "../App.js";
// import { UserListContext, MsgContext } from "../App.js";

function ChatRoom(props) {
  const { socket } = useContext(SocketContext);
  const { room } = useContext(UserListContext);
  const cookies = new Cookies().getAll();
  const userCookie = cookies.userdata;
  const username = userCookie.userName;

  // const { recipient, user } = useContext(UserListContext);

  const { recipient } = props;
  // const [messages, setMessages] = useState([]);
  const chatWindow = useRef(null);
  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  const handleReceiveMessage = useCallback(
    (pongData) => {
      // console.log("PONG", pongData)
      const newPublicMessage = makePublicMessage(pongData);
      // setMessages((prev) => [...prev, newPublicMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  const handleReceivePrivateMessage = useCallback(
    (pongData) => {
      const newPrivateMessage = makePrivateMessage(pongData);
      // setMessages((prev) => [...prev, newPrivateMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage);
    socket.on("PRIVATE", handleReceivePrivateMessage);

    return () => {
      socket.disconnect();
    };
  }, [socket, handleReceiveMessage]);

  useEffect(() => {
    console.log(recipient)
  }, [recipient])

  return (
    <div className="d-flex flex-column chat-form">
      <div id="greeting-box">
        <span className="username">{username}</span>
        joined in
        <span className="room">{room}</span>
        room.
      </div>
      <div className="chat-window card" ref={chatWindow}>
        <div className="d-flex flex-row chat-content">
          <div className="message-nickname">
            <Avatar url="../images/boy1-face.png" /> hey to hi : content
          </div>
        </div>
        <div className="d-flex flex-row chat-content">
          <div className="message-nickname">
            <Avatar url="../images/boy1-face.png" /> hey to hi : content
          </div>
        </div>
        <div className="d-flex flex-row chat-content">
          <div className="message-nickname">
            <Avatar url="../images/boy1-face.png" /> hey to hi : content
          </div>
        </div>
        <div className="d-flex flex-row chat-content">
          <div className="message-nickname">
            <Avatar url="../images/boy1-face.png" /> hey to hi : content
          </div>
        </div>
        <div className="d-flex flex-row chat-content">
          <div className="message-nickname">
            <Avatar url="../images/boy1-face.png" /> hey to hi : content
          </div>
        </div>
      </div>
      <MessageForm
        username={username}
        recipient={recipient}
        // user={user}
      />
      {/* 
      <div className="chat-window card" ref={chatWindow}>
        {messages.map((message, index) => {
          const { nickname, content, time, user } = message;
          // console.log("MESSAGE IN CHATROOM", message)
          let recipient = "";
          message.recipient
            ? (recipient = message.recipient)
            : (recipient = "all");
          return (
            <div key={index} className="d-flex flex-row chat-content">
              {nickname && (
                <div className="message-nickname">
                  <Avatar url={message.user.avatar} />
                  {"  "}
                  {nickname} to {recipient}: {content}
                </div>
              )}
            <div className="time">{time}</div>
            </div>
          );
        })}
      </div>
      <MessageForm nickname={username} recipient={recipient} user={user} /> */}
    </div>
  );
}

export default ChatRoom;
