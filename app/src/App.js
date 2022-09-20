import React, { useContext, useState, useEffect, createContext, useMemo } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import classroom from "./components/game_img/classroom.png";
import { socket, SOCKET_EVENT } from "./components/socket/socket.js";

import Login from "./components/Login";
import Register from "./components/Register";
import Game from "./components/Game";

import NotReady from "./components/NotReady";



export const SocketContext = createContext(socket);
export const UserListContext = createContext({});
export const MsgContext = createContext([]);

function App() {
  const [room, setRoom] = useState("plaza");
  const [character, setCharacter] = useState({});
  // const roomList = ["plaza", "js", "ruby", "react", "coffee"];
  const roomList = {
    plaza: "plaza",
    js: "js",
    ruby: "ruby",
    react: "react",
    coffee: "coffee"
  }
  const [onlineList, setOnlineList] = useState({});
  const [updateUserState, setUpdateUserState] = useState({});
  const [userCookie, setUserCookie] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  // let reSendData = false;
  const [reSendData, setReSendData] = useState(false)
  const [message, setMessage] = useState({})
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
    /** CHANGE ROOM */
    setOnlineList({})
    // return () => {
    //   socket.off();
    // };
  }, [room]);

  useEffect(() => {
    const cookie = new Cookies().getAll();
    const myName = cookie.userdata?.userName;
    /** ALL SOCKET SENDER */

    /** ALL SOCKET RECEIVER */
    socket && socket.on(room, ({ userNames, updatedUserName, avatar, reSend }) => {
      
      if (reSend) setReSendData(reSend);
      const filterUserNames = filterMyName(userNames, myName);
      
      if (myName !== updatedUserName && updatedUserName ) {
        const initAvatarPosition = {
          username: updatedUserName,
          avatar,
          x: 200,
          y: 420,
          currentDirection: 0,
          frameCount: 0
        };
        setUpdateUserState(initAvatarPosition);
        console.log("TESTPOINT", updatedUserName)
        if (!onlineList[updatedUserName]) {
          // setOnlineList(filterUserNames);
          setOnlineList(prev => ({
            ...prev,
            [updatedUserName]: {
              username: updatedUserName,
              avatar
            }
          }))
        }
      }
    });

    socket && socket.on("REMOVE LOGOUT USER", ({ updatedUserNames, removedName }) => {

      const filterUserNames = filterMyName(updatedUserNames, myName, removedName);
      const copyOnlineList = {...onlineList}
      delete copyOnlineList[removedName]
      setOnlineList(copyOnlineList);

      const removeAvatar = {
        username: removedName,
        remove: true
      };

      setUpdateUserState(removeAvatar);
      // setUpdateUserState() // remove from current object
    });

    socket.on(`sendData`, (userState) => {
      if (userState.remove) {
        const copyOnlineList = { ...onlineList };
        delete copyOnlineList[userState.username];
        setOnlineList(copyOnlineList)
      }
      if (userState.username !== myName) {
          setUpdateUserState(userState);
      }

    });

    socket.on("CURRENT USERS STATE", (resendUserState) => {
      // const checkUserName = myName === Object.Keys(filterMyName)
      // console.log(myName, filterUserState)
      // console.log("RECEIVED USER STATE", resendUserState)
      // const userName = Object.keys(resendUserState)[0]
      // console.log(userName)
      setOnlineList(prev => ({
        ...prev,
        [resendUserState.username]: {
          username: resendUserState.username,
          avatar: resendUserState.avatar
        }
      }))
      setUpdateUserState(resendUserState)
      // setReSendData(false)
    })


    // socket.on("RESEND DATA", (e) => {
    //   setReSendData(e)
    // })

    /** MESSAGES */
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, (messageContents) => {
      setMessage({...messageContents})
    })
    return () => {
      socket.off();
    };
  }, [socket, onlineList, room]);

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
    const cookies = new Cookies()
    const cookie = cookies.getAll();
    // const myName = cookie.userdata?.userName;
    if (cookie.userdata) {
      cookie.userdata = userData
    }
    if (!cookie.userdata) {
      cookies.set("userdata", userData, { maxAge: 36000 });
    }

    socket && socket.emit("SET USERNAME", {
      socketID: socket.id,
      username: userData.userName,
      currentRoom: room
    });
    navigate(`game/${room}`);
  };

  const moveAvatar = (userData) => {

  };

  const roomLists = Object.keys(roomList)
  const roomRoute = roomLists.map(roomName => {
    return (
      <Route path={`/game/${roomName}`} element={<Game character={character} setCharacter={setCharacter} />} key={roomName} />
    );
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      <UserListContext.Provider value={{ room, onlineList, userCookie, updateUserState, reSendData, setReSendData, message, roomList, setRoom, navigate }}>
        <Routes>
          <Route path="/register" element={<Register setUser={createSocketIdNameObj} />} />
          <Route path="/" element={<Login setUser={createSocketIdNameObj} />} />
          <Route path="/login" element={<Login setUser={createSocketIdNameObj} />} />
          {roomRoute}
          <Route path={`/notready`} element={<NotReady character={character} setCharacter={setCharacter} />} />
          {/* <Route path={`/game/${}`} element={<RETURN />} /> */}
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;