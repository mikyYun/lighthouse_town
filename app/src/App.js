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
  const [user, setUser] = useState({ value: "all", label: "all", avatar: 1 });
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
  // console.log("LOCATION", location);
  const nickname = location.state?.[0] || '';
  console.log("NICKNAME IN APP", nickname);
  const urlLists = [
    "/game/plaza",
    "/game/ruby",
    "/game/html",
    "/game/css",
    "/game/js",
    '/',
    "/register",
    "/login"
  ];

  // set map for navigate
  const maps = {
    plaza: town,
    js: classroom
  };
  const avatars = {
    0: "/images/boy1-face.png",
    1: "/images/boy2-face.png",
    2: "/images/girl1-face.png",
    3: "/images/girl2-face.png"
  };
  // console.log(avatars);

  // ================= INTANCES =============== //

  const cookies = new Cookies();
  const all_cookies = cookies.getAll();
  const cookieData = all_cookies.userdata;

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

    // setRoom(location.pathname.split("/").splice(2)[0]);

    const currentCookies = cookies.getAll();
    // cookies maxAge 3600.
    if (location.pathname === "/" && currentCookies.userdata && currentCookies["connect.sid"]) {
      // navigate('/game/plaza');
      createSocketIdNameObject(all_cookies.userdata.userName);
      goChat(cookieData.userName, cookieData.avatar, cookieData.userLanguages, cookieData.userID);
    } else if (!urlLists.includes(location.pathname)) {
      clearCookies();
      navigate("/");
    }
    // if (!urlLists.includes(location.pathname)) clearCookies();
  }, [location.pathname]);
  console.log("NEW PAGE LOADED"); // WORK


  useEffect(() => {

    // ================= FUNCTIONS =============== //


    console.log("ALL COOKIES", all_cookies); // WORK
    socket.on("connect", () => { // triggered in main page //
      console.log("CONNECT!!!!!!!!!!!!!!!!!!!!!!", socket.id);
      // })
      // console.log("SOCKETID", socket.id)
      //  게임에 들어왔는데 쿠키에 유저데이터가 없으면 메인페이지로
      // 메인페이지에서 쿠키 존재하면 게임페이지로
      // if (location.pathname === "/game") {
      // navigate("/")
      // }
      // 유저데이터가 아직 삭제되지 않았고, 게임페이지 리로드 한 경우 서버랑 연결하고 currentUser update in server
      if (all_cookies.userdata) {
        //     // 쿠키 존재하면 리커넥트 요청
        // socket.emit("hasCookies", ('test'))
        createSocketIdNameObject(all_cookies.userdata.userName);
        goChat(cookieData.userName, cookieData.avatar, cookieData.userLanguages, cookieData.userID);
        //     // goChat(res.data.userName, res.data.avatar, res.data.userLanguages, res.data.userID)

        //     // socket.emit("SET USERNAME", { username: all_cookies.userdata.userName, socketID: socket.id }); //maybe undefined
        //     // socket.emit("reconnection?", { username: all_cookies.userdata.userName, newSocketId: socket.id });
        //     // socket.on("DENY CONNECTION", (e) => {
        //     //   clearCookies()
        //     //   navigate("/")
        //     // })
        //     // navigate(urlLists[0]);// navigate 하면 같이 넘어갈 데이터 필요 (로그인 하고 넘겨주는 데이터)

      } else {
        //     // 쿠키 없거나 유저데이터가 없으면 홈으로
        clearCookies();
        navigate("/");
      }
    });

    // 유저가 연결될 때 마다 친구리스트 요청
    // socket.emit("friendsList", {socketID: socket.id})
    // 쿠키는 있는데 현재 사용중인 유저이면 클리어하고 집으로
    socket.on("DENY CONNECTION", (e) => {
      clearCookies();
      // navigate("/");
    });

    //frontend


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
      // obj => {name: {email:, avatar_id:, languages: [arr]}, {}, {}}

      const loginUsersObject = obj.users;
      // console.log("RECEIVED", loginUsersObject)
      const loginUserNames = Object.keys(loginUsersObject);
      const loginUsersInformation = {};
      const usersOnline = [];
      loginUserNames.map(name => {
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

      // navigate(urlLists[0])
      setOnline(usersOnline);
    }); // this works

    return () => {
      socket.disconnect();
    }; // => prevent memory leak..
  }, [socket]);

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

  const createSocketIdNameObject = (username) => { //WORKS
    console.log('socket - app.js', socket);
    socket && socket.emit("SET USERNAME", { socketID: socket.id, "username": username });
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
            <Route path='/' element={<Login setUser={createSocketIdNameObject} goChat={goChat} />} />
            <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
            <Route path='/login' element={<Login setUser={createSocketIdNameObject} goChat={goChat} />} />
            <Route path={`/game/${room}`} element={
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