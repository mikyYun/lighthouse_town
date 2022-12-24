import axios from "axios";
import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
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
  const roomList = {
    plaza: "plaza",
    js: "js",
    ruby: "ruby",
    react: "react",
    coffee: "coffee"
  };
  const [onlineList, setOnlineList] = useState({});
  const [updateUserState, setUpdateUserState] = useState({});
  const [userCookie, setUserCookie] = useState({});
  const navigate = useNavigate();
  const [reSendData, setReSendData] = useState(false);
  const [message, setMessage] = useState({});
  if (process.env.REACT_APP_BACK_URL) {
    axios.defaults.baseURL = process.env.REACT_APP_BACK_URL + "/api_cb/"
  }

  const backToHone = () => {
    navigate("/");
  };

  useEffect(() => {
    /** CHANGE ROOM */
    setOnlineList({});
  }, [room]);

  useEffect(() => {
    const cookie = new Cookies().getAll();
    const userData = cookie.userdata;
    if (!userData) backToHone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const cookie = new Cookies().getAll();
    const myName = cookie.userdata?.userName;

    /** ALL SOCKET RECEIVER */
    socket && socket.on(room, ({ updatedUserName, avatar, reSend }) => {
      if (reSend) setReSendData(reSend);

      if (myName !== updatedUserName && updatedUserName) {
        const initAvatarPosition = {
          username: updatedUserName,
          avatar,
          x: 200,
          y: 420,
          currentDirection: 0,
          frameCount: 0
        };
        setUpdateUserState(initAvatarPosition);
        if (!onlineList[updatedUserName]) {
          setOnlineList(prev => ({
            ...prev,
            [updatedUserName]: {
              username: updatedUserName,
              avatar
            }
          }));
        }
      }
    });

    socket && socket.on("REMOVE LOGOUT USER", (userState) => {
      const copyOnlineList = { ...onlineList };
        delete copyOnlineList[userState.username];
        setOnlineList(copyOnlineList);
      // setOnlineList(prev => ({
      //   ...prev,
      //   [userState.username]: undefined
      // }));
      setUpdateUserState(userState);
    });

    socket.on(`sendData`, (userState) => {
      if (userState.remove) {
        const copyOnlineList = { ...onlineList };
        delete copyOnlineList[userState.username];
        setOnlineList(copyOnlineList);
      } 
      if (userState.username !== myName) {
        setUpdateUserState(userState);
      }

    });

    socket.on("CURRENT USERS STATE", (resendUserState) => {
      setOnlineList(prev => ({
        ...prev,
        [resendUserState.username]: {
          username: resendUserState.username,
          avatar: resendUserState.avatar
        }
      }));
      setUpdateUserState(resendUserState);
    });

    /** MESSAGES */
    socket.on(SOCKET_EVENT.RECEIVE_MESSAGE, (messageContents) => {
      setMessage({ ...messageContents });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => socket.off();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineList, room]);


  const createSocketIdNameObj = (userData) => {
    setUserCookie(userData);
    const cookies = new Cookies();
    const cookie = cookies.getAll();
    if (cookie.userdata) {
      /** IF cookie userdata EXIST, update with new data */
      cookies.set("userdata", userData, { maxAge: 36000 });
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

  const updateFriendList = (updateOnline) => {
    const cookies = new Cookies();
    const userData = cookies.getAll().userdata;
    if (updateOnline.remove) {
      delete userData.userFriendsList[updateOnline.remove];
    } else {
      userData.userFriendsList = {
        ...userData.userFriendsList,
        ...updateOnline
      };
    }
    cookies.set("userdata", userData, { maxAge: 36000 });

    setUserCookie(userData);
  };
  const logout = (path) => {
    const cookies = new Cookies();
    const userData = cookies.getAll().userdata;
    const userState = {
      username: userData.userName
    };
    socket &&
      socket.emit("sendData", {
        userState,
        room: path,
        addTo: "logout"
      });
    cookies.remove("userdata");
    navigate("/");
    navigate(0);
  };


  const roomLists = Object.keys(roomList);
  const roomRoute = roomLists.map(roomName => {
    return (
      <Route path={`/game/${roomName}`} element={<Game character={character} setCharacter={setCharacter} />} key={roomName} />
    );
  });

  return (
    <SocketContext.Provider value={{ socket, axios }}>
      <UserListContext.Provider value={{ room, onlineList, userCookie, updateUserState, reSendData, setReSendData, message, roomList, setRoom, navigate, updateFriendList, logout, backToHone }}>
        <Routes>
          <Route path="/register" element={<Register setUser={createSocketIdNameObj} />} />
          <Route path="/" element={<Login setUser={createSocketIdNameObj} />} />
          <Route path="/login" element={<Login setUser={createSocketIdNameObj} />} />
          {roomRoute}
          <Route path={`/notready`} element={<NotReady />} />
          <Route path={`/:id`} element={<NotReady />} />
          <Route path={`/game/:id`} element={<NotReady />} />
          {/* <Route path={`/game/${}`} element={<RETURN />} /> */}
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;