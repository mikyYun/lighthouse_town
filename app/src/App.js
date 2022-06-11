import { useState, useEffect } from "react";

import { socket, SocketContext, SOCKET_EVENT } from "src/service/socket";

import NicknameForm from "src/components/NicknameForm";
import ChatRoom from "src/components/ChatRoom";

function App() {
  const [nickname, setNickname] = useState("김첨지");

  useEffect(() => {
    return () => { // App 컴포넌트 unmount시 실행
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    socket.emit(SOCKET_EVENT.JOIN_ROOM, { nickname }); // JOIN_ROOM event type과 nickname data를 서버에 전송한다.
  }, [nickname]);

  return (
    <SocketContext.Provider value={socket}>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <NicknameForm handleSubmitNickname={handleSubmitNickname} />
        <ChatRoom nickname={nickname} />
      </div>
    </SocketContext.Provider>
  );
}

export default App;