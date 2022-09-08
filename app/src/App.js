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

  useEffect(() => {
    console.log("SOCKET CONNECTED")
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  const createSocketIdNameObj = (username) => {
    console.log("CHECK");
    socket.email("SET USERNAME", {
      socketID: socket.id,
      username: username
    });
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{}}>
        <Routes>
          <Route path="/" element={<Login setUser={createSocketIdNameObj} />}></Route>
          <Route path="/register" element={<Register setUser={createSocketIdNameObj}/>}></Route>
          <Route path="/login" element={<Login setUser={createSocketIdNameObj} />}></Route>
          <Route path={`/game/${room}`} element={<Game />}></Route>
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;