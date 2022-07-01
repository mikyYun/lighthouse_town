import React, { useContext } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import town from './components/game_img/town-map.png';
import classroom from './components/game_img/classroom.png';
import Game from './components/Game';
import Register from './components/Register';
import Login from './components/Login';
import Menu from './components/Menu';
import { socket } from './components/service/socket.js';
import { createContext } from "react";

// import character imag


export const SocketContext = createContext(socket); // going to Recipient.jsx
export const UserListContext = createContext({});
export const MsgContext = createContext([]);
function App() {

  // ================= STATES =============== //

  // const [socket, setSocket] = useState();
  const [room, setRoom] = useState('plaza');
  const [online, setOnline] = useState([{ value: 'all', label: 'all' }]);
  const [friendList, setFriendList] = useState([]); // all friends
  const [show, setShow] = useState(false);
  const [clicked, setClicked] = useState({});
  const [recipient, setRecipient] = useState({ value: "all", label: "all" });
  const [user, setUser] = useState({ value: "all", label: "all", avatars: 1});
  const [profiles, setProfiles] = useState({});
  const [profileShow, setProfileShow] = useState("none");
  const [blockAddFriendAlert, setBlockAddFriendAlert] = useState("add-friend");
  const goChat = (username, avatar, userLanguages, id) => {
    const data = [username, avatar, userLanguages, id]
    navigate('/game/plaza', { state: data })
  }
  // ================= HOOKS =============== //

  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const location = useLocation();

  // ================= VARIABLES =============== //
  const nickname = location.state?.[0] || '';
  // console.log("NICKNAME IN APP", nickname);


  // set map for navigate
  const maps = {
    plaza: town,
    js: classroom
  };
  const avatars = {
    1: "/images/boy1-face.png",
    2: "/images/boy2-face.png",
    3: "/images/girl1-face.png",
    4: "/images/girl2-face.png"
  };
  // console.log(avatars);

  // ================= INTANCES =============== //

  const cookies = new Cookies();

  // ================= EFFECTS =============== //

  useEffect(() => {
    // console.log("USER",user);
  //[user.avatar] is a number (avatar id)
    // set URL for navigate when enter the house
    setRoom(location.pathname.split("/").splice(2)[0]);
    const currentCookies = cookies.getAll();

    if (currentCookies.userdata) {
      setUser({ ...user, avatar: avatars[currentCookies.userdata.avatar]});
    }
    // console.log('currentCookies', currentCookies)
    // cookies maxAge 3600.
    socket.on("connect", () => {
      // console.log("SOCKET CONNECTED", currentCookies); // everytime refresh
      //  if ((mainUrlLists.includes(location.pathname))

      if ((location.pathname === "/"
        || location.pathname === "/login"
        || location.pathname === "/register"
        || location.pathname === "/game"
        || location.pathname === "/game/plaza"
        )
        && currentCookies.userdata) {
        // console.log("cookies exist, permision allowed user") // checked
        createSocketIdNameObject(currentCookies.userdata.userName);
        const goChat = (username, avatar, userLanguages, id) => {
          const data = [username, avatar, userLanguages, id];
          navigate("/game/plaza", { state: data });
        };
        goChat(currentCookies.userdata.userName, currentCookies.userdata.avatar, currentCookies.userdata.userLanguages, currentCookies.userdata.userID);
        // console.log("LOCATION STATE",location.state) // checked
      }

      if ((location.pathname === "/game/js"
        || location.pathname === "/game/ruby"
      ) && currentCookies.userdata) {
        createSocketIdNameObject(currentCookies.userdata.userName);
      }
      if (!currentCookies.userdata) {
        // if (!urlLists.includes(location.pathname)) {
        console.log("NO USERDATA. CLEAR COOKIES"); // checked
        clearCookies();
        navigate("/");
      }
    });
    // if (!urlLists.includes(location.pathname)) clearCookies();
    // window.location.reload()
  }, [room]);

  useEffect(() => {

    // ================= FUNCTIONS =============== //

    socket.on("updateFriendsList", ({ newFriendName, languages }) => {
      const nameAndLangObj = {};
      nameAndLangObj[newFriendName] = { languages };
      setFriendList((prev) => ({
        ...prev,
        ...nameAndLangObj
      }));
    });

    socket.on("friendsListBack", friendsInfo => {
      setFriendList(friendsInfo);
    });

    socket.on("REGISTRATION SUCCESS", (userInfo) => {
      cookies.set("email", userInfo, { maxAge: 3600 });
      navigate("/game/plaza");
    });

    socket.on("init", msg => console.log("msg - App.js", msg)); //coming from server
    socket.on("backData", data => console.log("data", data)); //coming from server
    socket.on("all user names", (obj) => { //@@@SUNDAY: all user objects
      // obj => {uniqname: {email:, avatar_id:, languages: [arr]},
      //  uniqname: {},
      //  uniqname: {}
      // }

      const loginUsersObject = obj.users;
      // console.log("RECEIVED", loginUsersObject)
      const loginUserNames = Object.keys(loginUsersObject);
      const loginUsersInformation = {};
      const usersOnline = [];
      loginUserNames.map(name => {
        // console.log("AVATAR ID CHECK", [loginUsersObject[name].avatar_id])
        usersOnline.push({ value: name, label: name, avatar: avatars[loginUsersObject[name].avatar_id] });
        loginUsersInformation[name] = {
          name: name,
          email: loginUsersObject[name].email,
          languages: loginUsersObject[name].languages,
          avatar_id: loginUsersObject[name].avatar_id,
        };
      });
      // console.log("ONLINE USERS PROFILE SET",loginUsersInformation)
      setProfiles(loginUsersInformation);

      usersOnline.unshift({ value: "all", label: "all", avatar: avatars[0] });
      // const onlineOthers = usersOnline.filter(user => user.value !== nickname)
      // console.log("THIS WILL BE ONLINE OBJ", usersOnline)
      setOnline(usersOnline);
    }); // this works

    return () => {
      socket.disconnect();
    }; // => prevent memory leak..
  }, [socket]);

  // const RegistrationChecker = (val) => {
  //   socket && socket.emit("REGISTERED", val);
  // };

  const clearCookies = () => {
    const all_cookies = cookies.getAll();
    // if (all_cookies.length > 0) {
    Object.keys(all_cookies).forEach((each) => {
      cookies.remove(each);
    });
  };

  const createSocketIdNameObject = (username) => {
    // console.log(username, socket.id)
    socket && socket.emit("SET USERNAME", { "socketID": socket.id, "username": username });
  };

  const sendMessage = () => {
    socket && socket.emit("NEW MESSAGE", socket.id);
  };

  const privateMessage = (target, msg, username) => {
    socket && socket.emit("PRIVATE MESSAGE", { "target": target, "message": msg, "username": username });
  };

  return (
    <SocketContext.Provider value={{ socket }} >
      <UserListContext.Provider value={{ show, setShow, recipient, setRecipient, clicked, setClicked, user, setUser, profiles, nickname, setProfiles, profileShow, setProfileShow, blockAddFriendAlert, setBlockAddFriendAlert, online, friendList }} >
        <Routes>
          <Route path='/' element={<Login setUser={createSocketIdNameObject} />} />
          <Route path='/register' element={<Register setUser={createSocketIdNameObject}/>} />
          <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
          <Route path={`/game/${room}`} element={
            <Game
              sendMessage={sendMessage}
              sendPrivateMessage={privateMessage}
              setUser={createSocketIdNameObject}
              room={room}
              online={online}
              map={maps[room]}
            />} />
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );

}
export default App;