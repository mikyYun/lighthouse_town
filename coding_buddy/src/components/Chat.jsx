import NicknameForm from "./NicknameForm";
import { useState, useCallback, useEffect, useRef } from "react";
import { socket, SocketContext, SOCKET_EVENT } from "./service/socket";
import ChatRoom from "./ChatRoom";

export default function Chat(props) {

  const prevNickname = useRef(null); // prevNickname 변경은 컴포넌트를 리렌더링 하지않습니다.
  const [nickname, setNickname] = useState(props.username);
  const handleSubmitNickname = useCallback(newNickname => {
    prevNickname.current = nickname;
    setNickname(newNickname);
  }, [nickname]);

  useEffect(() => { //G
    socket.connect() //connecting to the server. G added this line.

    //before G's fix: we only had this return
    return () => { // App 컴포넌트 unmount시 실행 (when the component disappears from the DOM tree)
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (prevNickname.current) {
      socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, { // 서버에는 이전 닉네임과 바뀐 닉네임을 전송.
        prevNickname: prevNickname.current,
        nickname,
      });
    } else {
      socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickname });
      // JOIN_ROOM event type과 nickname data를 서버에 전송.
    }
  }, [nickname]);

  return (
    <SocketContext.Provider value={socket}>
      {/* //??PROVIDER ? */}
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 chatroom">
        {/* <NicknameForm handleSubmitNickname={handleSubmitNickname} /> */}
        <ChatRoom nickname={nickname} />
      </div>
    </SocketContext.Provider>
  )
}