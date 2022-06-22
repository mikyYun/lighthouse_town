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
  const [friendList, setFriendList] = useState([]);
  const [show, setShow] = useState(false);
  const [clicked, setClicked] = useState({});
  const [recipient, setRecipient] = useState({ value: "all", label: "all" });
  const [user, setUser] = useState({ value: "all", label: "all", avatar: 1 });
  const [profiles, setProfiles] = useState({});
  const [profileShow, setProfileShow] = useState("none");
  const [blockAddFriendAlert, setBlockAddFriendAlert] = useState("add-friend");

  // ================= HOOKS =============== //

  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const location = useLocation();

  // ================= VARIABLES =============== //
  // console.log("LOCATION", location);
  const nickname = location.state?.[0] || '';
  console.log("NICKNAME IN APP", nickname);


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


  // const addFriend = () => { }
  // const sendMessage = () => { }
  // const viewProfile = () => { }

  // ================= EFFECTS =============== //

  useEffect(() => {
    setUser({ ...user, avatar: avatars[user.avatar] }); //[user.avatar] is a number (avatar id)
    // @@@@@@@@@@@@ SUNDAY : WE SHOULD GET A USER FROM THE DATA BASE
    // @@@@@@@@@@@@ SUNDAY : WE SHOULD ALSO SET AN AVATAR WHEN WE GET AN USER OBJECT.
    // set URL for navigate when enter the house
    setRoom(location.pathname.split("/").splice(2)[0]);
    const currentCookies = cookies.getAll();
    // console.log('currentCookies', currentCookies)
    // cookies maxAge 3600.
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", currentCookies); // everytime refresh
      //  if ((mainUrlLists.includes(location.pathname))

      if ((location.pathname === "/"
        || location.pathname === "/login"
        || location.pathname === "/register"
        || location.pathname === "/game"
        || location.pathname === "/game/plaza")
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
      // if (subUrlLists.includes(location.pathname)) {
      //   console.log("IN GAME")
      // createSocketIdNameObject(currentCookies.userdata.userName);
      // const goChat = (username, avatar, userLanguages, id) => {
      //   // const data = [username, avatar, userLanguages, id];
      //   // navigate('/game/plaza', { state: data });
      // };
      // goChat(currentCookies.userdata.userName, currentCookies.userdata.avatar, currentCookies.userdata.userLanguages, currentCookies.userdata.userID);
      // }
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


    // socket.on("DENY CONNECTION", (e) => {
    //   clearCookies()
    //   navigate("/")
    // })

    // socket.on("updateFriendsList", newFriendInfo => {
    //   setFriendList(prev => ({
    //     ...prev,
    //     newFriendInfo
    //   }));
    // });
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

    // socket.on("update login users information", ({disconnectedUser}) => {
    //   // console.log("DISCONNECTED USERNAME", disconnectedUser)
    //   console.log("THIS", disconnectedUser)
    //   // const updateProfileLists = () => {
    //     // delete profiles[disconnectedUser]
    //   // }
    //   // setProfiles(prev => ({
    //   //   [disconnectedUser]: remove,
    //   //   ...rest
    //   // }))
    //   console.log("THIS", profiles)
    // })


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
      //@@@@ SUNDAY - this should be dynamic and need an avatar from socket.
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
  }, []);

  const RegistrationChecker = (val) => {
    socket && socket.emit("REGISTERED", val);
  };

  const clearCookies = () => {
    const all_cookies = cookies.getAll();
    // if (all_cookies.length > 0) {
    Object.keys(all_cookies).forEach((each) => {
      cookies.remove(each);
    });
  };

  const createSocketIdNameObject = (username) => {
    socket && socket.emit("SET USERNAME", { "socketID": socket.id, "username": username });
    // socket && socket.emit("REGISTERED", val); //if socket exists, then emit
  };

  const sendMessage = () => {
    socket && socket.emit("NEW MESSAGE", socket.id);
  };

  const privateMessage = (target, msg, username) => {
    socket && socket.emit("PRIVATE MESSAGE", { "target": target, "message": msg, "username": username });
  };

  // console.log('nickname', nickname)
  return (
    <SocketContext.Provider value={{ socket, online, nickname, friendList }} >
      <UserListContext.Provider value={{ show, setShow, recipient, setRecipient, clicked, setClicked, user, setUser, profiles, nickname, setProfiles, profileShow, setProfileShow, blockAddFriendAlert, setBlockAddFriendAlert }} >

        {/* clicked -> used in Menu.jsx
    setClicked -> used in Online.jsx */}
        {/* {show && <Menu username={nickname} />} */}
        <Routes>
          <Route path='/' element={<Login setUser={createSocketIdNameObject} />} />
          <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} setUser={createSocketIdNameObject}/>} />
          <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
          {/* <Route path={`/game/plaza`} element={ */}
          // <Route path={`/game/${room}`} element={
            <Game
              username={nickname}
              sendMessage={sendMessage}
              sendPrivateMessage={privateMessage}
              // sendData={sendData}
              setUser={createSocketIdNameObject}
              room={room}
              // nickname={nickname}
              online={online}
              map={maps[room]}
            />} />
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );

}
export default App;