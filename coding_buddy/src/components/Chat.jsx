import { useEffect, useRef, useCallback, useState } from "react";
import { socket, SocketContext, SOCKET_EVENT } from "./service/socket";
import NicknameForm from "./NicknameForm"
import ChatRoom from "./ChatRoom";
import Recipient from "./Recipient";
export default function Chat(props) {
  const prevNickname = useRef(null); // prevNickname 변경은 컴포넌트를 리렌더링 하지않습니다.
  const [nickname, setNickname] = useState(props.username);
  const handleSubmitNickname = useCallback(newNickname => {
    prevNickname.current = nickname;
    setNickname(newNickname);
  }, [nickname]);
  // now using the function from game component

  // useEffect(() => {
  //   if (prevNickname.current) {
  //     socket.emit(SOCKET_EVENT.UPDATE_NICKNAME, { // 서버에는 이전 닉네임과 바뀐 닉네임을 전송.
  //       prevNickname: prevNickname.current,
  //       nickname,
  //     });
  //   } else {
  //     socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickname });
  //     // JOIN_ROOM event type과 nickname data를 서버에 전송.
  //   }
  // }, [nickname]);

  return (
    // <SocketContext.Provider value={socket} users={nickname}>
    // should be in the top in component tree. app.js
    // every component underneath Chat.jsx will be able to access this contexts.
    <>
      <div className="d-flex flex-column chatroom">
        <Recipient />
        <ChatRoom nickname={nickname} room={props.room} />
      </div>
      {/* // </SocketContext.Provider> */}
    </>
  )
}