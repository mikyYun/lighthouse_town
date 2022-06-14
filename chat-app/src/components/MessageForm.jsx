import { useState, useCallback, useContext } from "react";

import { SocketContext, SOCKET_EVENT } from "service/socket";

function MessageForm({ nickname }) {
  const [typingMessage, setTypingMessage] = useState("");
  const socket = useContext(SocketContext);

  // textarea에서 텍스트를 입력하면 typingMessage state를 변경합니다.
  const handleChangeTypingMessage = useCallback(event => {
    setTypingMessage(event.target.value);
  }, []);

  // 버튼을 누르면 실행합니다.
  const handleSendMesssage = useCallback(() => {
    // 공백을 trim()으로 제거합니다.
    const noContent = typingMessage.trim() === "";

    // 아무 메시지도 없으면 아무 일도 발생하지 않습니다.
    if (noContent) {
      return;
    }

    // 메시지가 있으면 nickname과 message를 SEND_MESSAGE 이벤트 타입과 함께 소켓 서버로 전송합니다.
    socket.emit(SOCKET_EVENT.SEND_MESSAGE, { //send it index.js
      nickname,
      content: typingMessage,
    });
    // state값은 공백으로 변경해줍니다.
    setTypingMessage("");
  }, [socket, nickname, typingMessage]);

  return (
    <form className="card">
      <div className="d-flex align-items-center">
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
          onClick={handleSendMesssage}
        >
          전송
        </button>
      </div>
    </form>
  );
}

export default MessageForm;