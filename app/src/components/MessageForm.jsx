import { useState, useCallback, useContext, useRef, useEffect } from "react";
import { SOCKET_EVENT } from "./socket/socket.js";
import { SocketContext, UserListContext } from "../App.js";
import Cookies from "universal-cookie";
//이 컴포넌트는 메시지 입력창에 입력하고 있는 텍스트를 state로 관리합니다.그리고 전송 버튼을 누르면 handleSendMessage함수가 실행되어 SEND_MESSAGE 이벤트를 username과 입력한 텍스트 데이터와 함께 소켓 서버로 emit합니다.ChatRoom에서 이 컴포넌트를 import 해줍니다.

function MessageForm({ username, recipient, user }) {
  const [typingMessage, setTypingMessage] = useState("");
  const { socket } = useContext(SocketContext);
  const { message, room } = useContext(UserListContext);
  const [textareaDisable, setTextareaDisable] = useState(true)
  const focusTextArea = useRef()
  
  // socket, socket_event object
  // textarea에서 텍스트를 입력하면 typingMessage state를 변경합니다.
  const handleChangeTypingMessage = useCallback((event) => {
    setTypingMessage(event.target.value);
  }, []);
  


  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === "";
    /** TRIM MESSAGE IS EMPTY */
    if (noContent) {
      // console.log("no content received");
      return;
    }

    const cookie = new Cookies().getAll().userdata
    const sender = cookie.userName
    const avatar = cookie.avatar
    if (recipient !== "all") {
      /** PRIVATE CHAT */
      socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
        username: recipient,
        content: typingMessage,
        recipient,
        sender,
        avatar,
        isPrivate: true
      })
      // socket.emit("PRIVATE", {
      //   username, // whole user information
      //   content: typingMessage,
      //   recipient,
      //   senderSocketId: socket.id,
      //   user,
      // });
    } else {
      /** PUBLIC CHAT */
      socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
        username,
        content: typingMessage,
        recipient,
        sender,
        avatar,
        room: room
      });
    }
    setTypingMessage("");
  }, [socket, username, typingMessage, recipient]);

  return (
    <form id="type-area">
      <div className="type-box">
        <textarea
          className="form-control"
          placeholder="type your message here "
          ref={focusTextArea}
          readOnly={textareaDisable}
          maxLength={400}
          value={typingMessage}
          onChange={handleChangeTypingMessage}
          onMouseDown={() => {
            setTextareaDisable(false)
            focusTextArea.current.focus()
          }}
          onFocus={() => {
            setTextareaDisable(false)
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
