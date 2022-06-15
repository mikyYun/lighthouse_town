import { useState, useCallback, useEffect, useContext, useRef } from "react";
import MessageForm from "./MessageForm";
import NicknameForm from './NicknameForm';

import { SocketContext, SOCKET_EVENT, makeMessage } from "./service/socket";

function ChatRoom({ nickname }) {
  const [messages, setMessages] = useState([]);
  const chatWindow = useRef(null);
  const socket = useContext(SocketContext);

  // 새 메시지를 받으면 스크롤을 이동하는 함수
  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // RECEIVE_MESSAGE 이벤트 콜백: messages state에 데이터를 추가합니다.
  // @@@@ Message.Form line 26 & socket > index.js line 68
  const handleReceiveMessage = useCallback(pongData => {

    const newMessage = makeMessage(pongData);
    // makeMessage 는 service > socket.js 에 있음.
    setMessages(messages => [...messages, newMessage]); //????이해안됌
    moveScrollToReceiveMessage();
  },
    [moveScrollToReceiveMessage] //????이해안됌
  );

  useEffect(() => {
    console.log(messages)
  }, [messages])

  useEffect(() => {
    console.log("are you receiving?")
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage); // 이벤트 리스너 설치

    return () => {
      socket.off(SOCKET_EVENT.RECEIVE_MESSAGE, handleReceiveMessage); // 이벤트 리스너 해제
    };
  }, [socket, handleReceiveMessage]);

  console.log('hello this is chat message', messages)
  return (
    <div
      className="d-flex flex-column"
      style={{ width: 300 }}
    >
      <div className="text-box">
        <span>{nickname}</span>, Welcome!
      </div>
      <div
        className="chat-window card"
        ref={chatWindow}
      >
        {messages.map((message, index) => {
          const { nickname, content, time } = message;
          return (
            <div key={index} className="d-flex flex-row">
              {nickname && <div className="message-nickname">{nickname}: </div>}
              <div>{content}</div>
              <div className="time">{time}</div>
            </div>
          );
        })}
      </div>
      <MessageForm nickname={nickname} />
    </div>
  );

}

export default ChatRoom;