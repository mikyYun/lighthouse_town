import { useState, useCallback, useEffect, useContext, useRef, createContext } from "react";
import MessageForm from "./MessageForm";
import Avatar from "./Avatar.jsx";
import {
  SOCKET_EVENT,
  makePublicMessage,
  makePrivateMessage,
} from "./service/socket";
import { SocketContext } from "../App.js";
import { UserListContext, MsgContext } from "../App.js";

function ChatRoom(props) {
  const { socket } = useContext(SocketContext);
  const { recipient, user } = useContext(UserListContext);
  const { username } = props;
  const [messages, setMessages] = useState([]);
  const chatWindow = useRef(null);
  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  // console.log("USER!!",user)
  // RECEIVE_MESSAGE 이벤트 콜백: messages state에 데이터를 추가.
  // MessageForm & socket > index.js
  // socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
  const handleReceivePublicMessage = useCallback(
    (pongData) => {
      // console.log("PONG", pongData)
      const newPublicMessage = makePublicMessage(pongData);
      setMessages((messages) => [...messages, newPublicMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  const handleReceivePrivateMessage = useCallback(
    (pongData) => {
      const newPrivateMessage = makePrivateMessage(pongData);
      setMessages((messages) => [...messages, newPrivateMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  useEffect(() => {
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceivePublicMessage); // 이벤트 리스너 - 퍼블릭 메세지
    socket.on("PRIVATE", handleReceivePrivateMessage); // 이벤트 리스너 - 프라이빗 메세지

    return () => {
      socket.disconnect();
      // socket.off(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage); // 이벤트 리스너 해제
      //@@이거 왜 off 안하고 disconnect로 함?
    };
  }, [socket, handleReceivePublicMessage]);
  //@@@@ 이거 왜 public message??? private message 는??
  console.log("AVATAR CHECK IN CHATROOM", messages)

  return (
    <div className="d-flex flex-column chat-form">
      <div className="text-box">
        <p><span>{username}</span>, Welcome!</p>
      </div>
      <div className="chat-window card" ref={chatWindow}>
        {messages.map((message, index) => {
          const { nickname, content, time, user } = message;
          let recipient = "";
          message.recipient
            ? (recipient = message.recipient)
            : (recipient = "all");
          return (
            <div key={index} className="d-flex flex-row">
              {nickname && (
                <div className="message-nickname">
                  <Avatar url={message.user?.avatar} />
                  {"  "}
                  {nickname} to {recipient}: {content}
                </div>
              )}
            <div className="time">{time}</div>
            </div>
          );
        })}
      </div>
      <MessageForm nickname={username} recipient={recipient} user={user} />
    </div>
  );

}

export default ChatRoom;