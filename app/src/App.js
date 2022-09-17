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
  const [updateUserState, setUpdateUserState] = useState({});
  const [userCookie, setUserCookie] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  // let reSendData = false;
  const [reSendData, setReSendData] = useState(false)

  const filterMyName = (userNamesArr, myName, removedName,) => {
    // console.log("CHECK",userNamesArr, removedName, myName)
    return userNamesArr.filter(userName => userName !== myName && userName !== removedName);
  };
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

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const cookie = new Cookies().getAll();
    const myName = cookie.userdata?.userName;
    /** ALL SOCKET SENDER */

    /** ALL SOCKET RECEIVER */
    socket && socket.on(room, ({ userNames, updatedUserName, avatar }) => {
      const filterUserNames = filterMyName(userNames, myName);

      if (myName !== updatedUserName) {
        const initAvatarPosition = {
          username: updatedUserName,
          avatar,
          x: 200,
          y: 420,
          currentDirection: 0,
          frameCount: 0
        };
        setUpdateUserState(initAvatarPosition);
      }
      setOnlineList(filterUserNames);
    });

    socket && socket.on("REMOVE LOGOUT USER", ({ updatedUserNames, removedName }) => {

      const filterUserNames = filterMyName(updatedUserNames, myName, removedName);

      setOnlineList(filterUserNames);
      // console.log("HERE")
      // setOnlineList(updatedUserNames)

      const removeAvatar = {
        username: removedName,
        remove: true
      };

      setUpdateUserState(removeAvatar);
      // setUpdateUserState() // remove from current object
    });

    socket.on(`sendData`, (userState) => {
      if (userState.username !== myName) {
        setUpdateUserState(userState);
      }
    });

    socket.on("RESEND DATA", (e) => {
      setReSendData(e)
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
    setUserCookie(userData);
    socket && socket.emit("SET USERNAME", {
      socketID: socket.id,
      username: userData.userName,
      currentRoom: room
    });
    navigate(`game/${room}`);
  };

  const moveAvatar = (userData) => {

  };

  const roomRoute = roomList.map(roomName => {
    return (
      <Route path={`/game/${roomName}`} element={<Game character={character} setCharacter={setCharacter} />} key={roomName} />
    );
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room, onlineList, userCookie, updateUserState, reSendData, setReSendData }}>
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