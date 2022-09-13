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
  const [userCookie, setUserCookie] = useState({})

  const navigate = useNavigate();
  const cookie = new Cookies().getAll().userdata;
  const username = cookie?.userName;
  const filterMyName = (userNamesArr) => {
    console.log(username)
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
    // storeUserCookie(cookie)
    updateUserSocketId(username);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // ALL SOCKET RECEIVER
    socket && socket.on(room, (userNamesObj) => {
      const userNames = userNamesObj.userNames;
      const filterUserNames = filterMyName(userNames);
      
      setOnlineList(filterUserNames);
    });

    socket && socket.on("REMOVE LOGOUT USER", ({updatedUserNames}) => {

      const filterUserNames = filterMyName(updatedUserNames)
      setOnlineList(filterUserNames)
    })

    return () => {
      // socket.off();
    };
  }, [socket, onlineList]);

  // const storeUserCookie = (userCookieData) => {
  //   console.log("HE", userCookieData)
  //   if (userCookieData) {
  //     setUserCookie(userCookieData)
  //     console.log(userCookie)
  //   }
  // }

  const updateUserSocketId = (username) => {
    if (username) {
      console.log(username, room, "EXIST")
      socket && socket.emit("UPDATE SOCKETID", {
        username, currentRoom: room
      });
    }
  };
  // useEffect(() => {
    // console.log("userCookie", userCookie)
  // }, [userCookie])

  const createSocketIdNameObj = (userData) => {
    setUserCookie(userData)
    socket && socket.emit("SET USERNAME", {
      socketID: socket.id,
      username: userData.userName,
      currentRoom: room
    });
    navigate(`game/${room}`);
  };

  const moveAvatar = (userData) => {

  }

  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room, onlineList, userCookie }}>
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