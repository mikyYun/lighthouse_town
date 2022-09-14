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
  const [updateUserState, setUpdateUserState] = useState({})

  const [userCookie, setUserCookie] = useState({})
  const navigate = useNavigate();
  const location = useLocation();
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
    console.log("username",username)
    // if (location.pathname !== "/") {
      // updateUserSocketId(username);
    // }

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    /** ALL SOCKET SENDER */
    // updateUserSocketId(username);

    /** ALL SOCKET RECEIVER */
    socket && socket.on(room, (userNamesObj) => {
      const userNames = userNamesObj.userNames;
      const filterUserNames = filterMyName(userNames);
      
      setOnlineList(filterUserNames);
    });

    socket && socket.on("REMOVE LOGOUT USER", ({updatedUserNames}) => {

      const filterUserNames = filterMyName(updatedUserNames)
      setOnlineList(filterUserNames)
    })

    socket.on(`sendData`, (userState) => {
      setUpdateUserState(userState)
    })

    return () => {
      socket.off();
    };
  }, [socket, onlineList]);

  // const storeUserCookie = (userCookieData) => {
  //   console.log("HE", userCookieData)
  //   if (userCookieData) {
  //     setUserCookie(userCookieData)
  //     console.log(userCookie)
  //   }
  // }

  // const updateUserSocketId = (username) => {
  //   if (username) {
  //     console.log(username, room, "APP")
  //     socket && socket.emit("UPDATE SOCKETID", {
  //       username, currentRoom: room
  //     });
  //   }
  // };
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

  const roomRoute = roomList.map(roomName => {
    return (
      <Route path={`/game/${roomName}`} element={<Game character={character} setCharacter={setCharacter} />} key={roomName} />
    );
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room, onlineList, userCookie, updateUserState }}>
        <Routes>
          <Route path="/register" element={<Register setUser={createSocketIdNameObj} />} />
          <Route path="/" element={<Login setUser={createSocketIdNameObj} />} />
          <Route path="/login" element={<Login setUser={createSocketIdNameObj} />} />
          {roomRoute}
          {/* <Route path={`/game/${}`} element={<RETURN />} /> */}
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;