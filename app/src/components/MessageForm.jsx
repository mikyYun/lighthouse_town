import { useState, useCallback, useContext, useRef } from "react";
import { SOCKET_EVENT } from "./socket/socket.js";
import { SocketContext, UserListContext } from "../App.js";
import Cookies from "universal-cookie";


function MessageForm({ username, recipient }) {
  const [typingMessage, setTypingMessage] = useState("");
  const { socket } = useContext(SocketContext);
  const { room } = useContext(UserListContext);
  const [textareaDisable, setTextareaDisable] = useState(true)
  const focusTextArea = useRef()
  const handleChangeTypingMessage = useCallback((event) => {
    setTypingMessage(event.target.value);
  }, []);
  


  const handleSendMesssage = useCallback(() => {
    const noContent = typingMessage.trim() === "";
    // /** TRIM MESSAGE IF EMPTY */
    if (noContent) {
      return;
    }

    const cookie = new Cookies().getAll().userdata
    const sender = username
    const avatar = cookie.avatar
    if (recipient !== "all") {
      /** PRIVATE CHAT */
      socket.emit(SOCKET_EVENT.SEND_MESSAGE, {
        username,
        content: typingMessage,
        recipient,
        sender,
        avatar,
        isPrivate: true
      })
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
