import React, { useContext, useState, useEffect, createContext } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import classroom from "./components/game_img/classroom.png";
import { socket } from "./components/socket/socket.js";

import Login from "./components/Login";
import Register from "./components/Register";
import Game from "./components/Game";

export const SocketContext = createContext(socket);
export const UserListContext = createContext({});
export const MsgContext = createContext([]);

function App() {
  const [room, setRoom] = useState("plaza");
  const [character, setCharacter] = useState({})
  const roomList = ["plaza", "js", "ruby", "react", "coffee"]

  const roomRoute = roomList.map(roomName => {
    return (
      <Route path={`/game/${roomName}`}  element={<Game character={character} setCharacter={setCharacter} />} key={roomName}/>
    )
  })

  useEffect(() => {
    console.log("SOCKET CONNECTED");
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  const createSocketIdNameObj = (username) => {
    socket?.email("SET USERNAME", {
      socketID: socket.id,
      username: username
    });
  };
  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room }}>
        <Routes>
          <Route path="/register" element={<Register setUser={createSocketIdNameObj} />} />
          <Route path="/" element={<Login setUser={createSocketIdNameObj} />} />
          <Route path="/login" element={<Login setUser={createSocketIdNameObj} />} />
          {/* <Route path={`/game/${room}`} element={<Game />} /> */}
          {roomRoute}
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;