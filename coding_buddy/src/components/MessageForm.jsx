import { useState, useCallback, useContext } from "react";
import { SOCKET_EVENT } from "./service/socket.js";
import { SocketContext } from '../App.js'

//이 컴포넌트는 메시지 입력창에 입력하고 있는 텍스트를 state로 관리합니다.그리고 전송 버튼을 누르면 handleSendMessage함수가 실행되어 SEND_MESSAGE 이벤트를 nickname과 입력한 텍스트 데이터와 함께 소켓 서버로 emit합니다.ChatRoom에서 이 컴포넌트를 import 해줍니다.

function MessageForm({ nickname, recipient }) {
  const [typingMessage, setTypingMessage] = useState("");
  const {socket} = useContext(SocketContext);
  console.log("MESSAGE", socket)
  //  socket, socket_event object
  // textarea에서 텍스트를 입력하면 typingMessage state를 변경합니다.
  const handleChangeTypingMessage = useCallback(event => {
    setTypingMessage(event.target.value);
  }, []);

  // 버튼을 누르면 실행합니다.
  const handleSendMesssage = useCallback(() => {
    // 공백을 trim()으로 제거합니다.
    console.log("handleSendMesssage", handleSendMesssage)
    const noContent = typingMessage.trim() === "";

    // 아무 메시지도 없으면 아무 일도 발생하지 않습니다.
    if (noContent) {
      console.log("no content received")
      return;
    }
    console.log("socket", socket)
    // @@@@ 메시지가 있으면 nickname과 message를 SEND_MESSAGE 이벤트 타입과 함께 소켓 서버로 (socket > index. js) 전송합니다.
    socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
      nickname,
      content: typingMessage,
    });
    console.log("hi gabriel")
    // state값은 공백으로 변경해줍니다.
    setTypingMessage("");
  }, [socket, nickname, typingMessage]);

  return (
    <form className="card">
      <div className="align-items-center">
        <textarea
          className="form-control"
          maxLength={400}
          autoFocus
          value={typingMessage}
          onChange={handleChangeTypingMessage}
        />
        <button
          type="button"
          className="btn btn-primary send-btn"
          // onClick={handleSendMesssage}
          onClick={() => {
            console.log("REC", recipient)
          }}
        >
          SEND
        </button>
      </div>
    </form>
  );
}

export default MessageForm;