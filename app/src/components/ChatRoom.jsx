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
  const { room, message } = useContext(UserListContext);
  const cookies = new Cookies().getAll();
  const userCookie = cookies.userdata;
  const username = userCookie.userName;
  const [messageHistory, setMessageHistory] = useState([]);
  const { recipient } = props;
  const chatWindow = useRef(null);

  useEffect(() => {
    setMessageHistory((prev) => [...prev, message]);
    moveScrollToReceiveMessage();
  }, [message]);

  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  // const handleReceiveMessage = useCallback(
  //   (pongData) => {
  //     const newPublicMessage = makePublicMessage(pongData);
  //     setMessages((prev) => [...prev, newPublicMessage]);
  //     moveScrollToReceiveMessage();
  //   },
  //   [moveScrollToReceiveMessage]
  // );

  // const handleReceivePrivateMessage = useCallback(
  //   (pongData) => {
  //     const newPrivateMessage = makePrivateMessage(pongData);
  //     setMessages((prev) => [...prev, newPrivateMessage]);
  //     moveScrollToReceiveMessage();
  //   },
  //   [moveScrollToReceiveMessage]
  // );

  // useEffect(() => {
  //   socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceivePrivateMessage);

  //   return () => {
  //     socket.off();
  //   };
  // }, [socket, handleReceiveMessage]);

  // useEffect(() => {
  //   console.log(recipient);
  // }, [recipient]);

  const createMessage = () => {
    if (messageHistory.length > 0) {
      return messageHistory.map((msgContent, index) => {
        const privateOrPublic = msgContent.type === "PRIVATE" ? "private" : "public"
        if (index !== 0) {
          return (
            <div
              className="d-flex flex-row chat-content"
              key={msgContent.sender + msgContent.username + index}
              // ref={index === messageHistory.length - 1 && chatWindow}
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
        }
      });
    }
  };

  return (
    <div className="d-flex flex-column chat-form">
      <div id="greeting-box">
        <span className="username">{username}</span>
        joined in
        <span className="room">{room}</span>
        room.
      </div>
      <div className="chat-window card" ref={chatWindow}>
        {createMessage()}
        <div className="d-flex flex-row chat-content" ></div>
      </div>
      <MessageForm username={username} recipient={recipient} user={username} />

    </div>
  );
}

export default ChatRoom;
