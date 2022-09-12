import React, { useContext, useState, useEffect, createContext, useMemo } from "react";
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
  const [character, setCharacter] = useState({});
  const roomList = ["plaza", "js", "ruby", "react", "coffee"];
  const [onlineList, setOnlineList] = useState([]);
  const roomRoute = roomList.map(roomName => {
    return (
      <Route path={`/game/${roomName}`} element={<Game character={character} setCharacter={setCharacter} />} key={roomName} />
    );
  });
  const navigate = useNavigate();
  const cookie = new Cookies().getAll().userdata;
  const username = cookie?.userName;
  const filterMyName = (userNamesArr) => {
    return userNamesArr.filter(userName => userName !== username)
  }
  // useEffect(() => {
  //   socket.on("connection", (serverSocket) => {
  //     console.log("Client socket connected with server")
  //   })
  // }, [socket])
  // useEffect(() => {
  // console.log("SOCKET CONNECTED");
  // return () => {
  //   socket.disconnect();
  // };
  // }, [socket]);
  // useEffect(() => {
  //   console.log(socket)
  //   return 
  // }, [socket])
  useEffect(() => {
    /** PAGE REFRESH UPDATE NEW SOCKET ID */
    // const cookie = new Cookies().getAll().userdata;
    // const username = cookie?.userName;

    updateUserSocketId(username);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // ALL SOCKET RECEIVER
    socket.on(room, (userNamesObj) => {
      const userNames = userNamesObj.userNames;
      const filterUserNames = filterMyName(userNames);
      
      setOnlineList(filterUserNames);
    });

    socket.on("REMOVE LOGOUT USER", ({updatedUserNames}) => {

      const filterUserNames = filterMyName(updatedUserNames)
      setOnlineList(filterUserNames)
    })

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const updateUserSocketId = (username) => {
    if (username) {

      socket && socket.emit("UPDATE SOCKETID", {
        username, currentRoom: room
      });
    }
  };

  const createSocketIdNameObj = (username) => {

    socket && socket.emit("SET USERNAME", {
      socketID: socket.id,
      username: username,
      currentRoom: room
    });
    navigate(`game/${room}`);
  };
  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room, onlineList }}>
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