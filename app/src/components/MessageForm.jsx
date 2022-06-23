import { useState, useCallback, useContext, useRef } from "react";
import { SOCKET_EVENT } from "./service/socket.js";
import { SocketContext } from "../App.js";

//이 컴포넌트는 메시지 입력창에 입력하고 있는 텍스트를 state로 관리합니다.그리고 전송 버튼을 누르면 handleSendMessage함수가 실행되어 SEND_MESSAGE 이벤트를 nickname과 입력한 텍스트 데이터와 함께 소켓 서버로 emit합니다.ChatRoom에서 이 컴포넌트를 import 해줍니다.

function MessageForm({ nickname, recipient, user }) {
  const [typingMessage, setTypingMessage] = useState("");
  const { socket } = useContext(SocketContext);
  const [textareaDisable, setTextareaDisable] = useState(true)
  const focusTextArea = useRef()
  // socket, socket_event object
  // textarea에서 텍스트를 입력하면 typingMessage state를 변경합니다.
  const handleChangeTypingMessage = useCallback((event) => {
    setTypingMessage(event.target.value);
  }, []);

  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === "";

    if (noContent) {
      // console.log("no content received");
      return;
    }
    // console.log("socket", recipient)
    // @@@@ 메시지가 있으면 nickname과 message를 SEND_MESSAGE 이벤트 타입과 함께 소켓 서버로 (socket > index. js) 전송합니다.
    if (recipient.value !== "all") {
      socket.emit("PRIVATE", {
        nickname, // whole user information
        content: typingMessage,
        recipient: recipient,
        senderSocketId: socket.id,
        user,
      });
    } else {
      socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
        nickname,
        content: typingMessage,
        user,
      });
    }
    // console.log({nickname, content: typingMessage, user})
    setTypingMessage("");
  }, [socket, nickname, typingMessage, recipient]);

  function chatBubble() {

  }


  // document.addEventListener("keyup", (e) => {
  //   if (e.key === "Enter") {
  //     setTextareaDisable(false)
  //     focusTextArea.current.focus()
  //   }
  // })

  return (
    <form >
      <div >
        <textarea
          ref={focusTextArea}
          readOnly={textareaDisable}
          className="form-control"
          maxLength={400}
          value={typingMessage}
          placeholder="type your message here "
          onChange={handleChangeTypingMessage}
          onMouseDown={() => {
            setTextareaDisable(false)
            focusTextArea.current.focus()
          }}
        />
        <button
          type="button"
          className="send-btn"
          onClick={handleSendMesssage}

        >
          SEND
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
