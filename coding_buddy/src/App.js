import React, { useContext } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import town from './components/game_img/town-map.png';
import classroom from './components/game_img/classroom.png';
import Game from './components/Game';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Menu from './components/Menu';
import { socket } from './components/service/socket.js';
import { createContext } from "react";
// import map images

export const SocketContext = createContext(socket); // going to Recipient.jsx
export const UserListContext = createContext({});
function App() {

  // ================= STATES =============== //

  // const [socket, setSocket] = useState();
  const [room, setRoom] = useState('plaza');
  const [online, setOnline] = useState([{ value: 'all', label: 'all' }]);
  const [friendList, setFriendList] = useState([])
  const [show, setShow] = useState(false);
  const [clicked, setClicked] = useState({})
  const [recipient, setRecipient] = useState({ value: "all", label: "all" });

  // ================= HOOKS =============== //

  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const location = useLocation();

  // ================= VARIABLES =============== //

  const nickname = location.state?.[0] || '';
  const urlLists = [
    "/game/plaza",
    "/game/ruby",
    "/game/html",
    "/game/css",
    "/game/js",
    //  '/'
  ];

  // set map for navigate
  const maps = {
    plaza: town,
    js: classroom
  }

  // ================= INTANCES =============== //

  const cookies = new Cookies();


  // const addFriend = () => { }
  // const sendMessage = () => { }
  // const viewProfile = () => { }

  // ================= EFFECTS =============== //

  useEffect(() => {
    // set URL for navigate when enter the house
    setRoom(location.pathname.split("/").splice(2)[0]);
    const currentCookies = cookies.getAll();

    if (!urlLists.includes(location.pathname)) clearCookies();
  }, [location.pathname]);

  useEffect(() => {


    /* serversided
        socket.on("disconnect", () => {
          console.log("DISCONNECT", socket.id);
          const alluserNames = Object.keys(currentUsers);
          alluserNames.forEach((name) => {
            if (currentUsers[name] === socket.id)
              delete currentUsers[name];
          }); // {"users": [name1, name2] }
          console.log("DISCONNECT - CURRENT USERS", currentUsers);
          io.emit("all user names", { "users": alluserNames }); // App.jsx & Recipients.jsx 로 보내기
        });
    */


    //frontend
    socket.on("connect", () => {
      const all_cookies = cookies.getAll();
      //  게임에 들어왔는데 쿠키에 유저데이터가 없으면 메인페이지로
      // if (location.pathname === "/game") {
      // navigate("/")
      // }
      // 유저데이터가 아직 삭제되지 않았고, 게임페이지 리로드 한 경우 서버랑 연결하고 currentUser update in server
      if (all_cookies.userdata) {
        // 쿠키 존재하면 리커넥트 요청
        socket.emit("reconnection?", { username: all_cookies.userdata.userName, newSocketId: socket.id });
        // socket.on("DENY CONNECTION", (e) => {
        //   clearCookies()
        //   navigate("/")
        // })
      } else {
        // 쿠키 없으면 홈으로
        navigate("/");
      }
      // 유저가 연결될 때 마다 친구리스트 요청
      // socket.emit("friendsList", {socketID: socket.id})
      // 쿠키는 있는데 현재 사용중인 유저이면 클리어하고 집으로
      socket.on("DENY CONNECTION", (e) => {
        // clearCookies();
        navigate("/");
      });
    }, []);

    // socket.on("DENY CONNECTION", (e) => {
    //   clearCookies()
    //   navigate("/")
    // })

    socket.on("friendsListBack", friendsInfo => {
      setFriendList(friendsInfo)
    })

    socket.on("REGISTRATION SUCCESS", (userInfo) => {
      cookies.set("email", userInfo);
      navigate("/game/plaza");
    });

    socket.on("init", msg => console.log("msg - App.js", msg)); //coming from server
    socket.on("backData", data => console.log("data", data)); //coming from server

    socket.on("all user names", (obj) => {
      // obj.users = [user1, user2] => [{value: name, label: name } {}]
      const usersOnline = obj.users.map(name => ({ value: name, label: name }));
      usersOnline.unshift({ value: "all", label: "all" });
      // const onlineOthers = usersOnline.filter(user => user.value !== nickname)

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

  const sendData = (state) => {
    socket && socket.emit("sendData", state);
  };

  return (
    <SocketContext.Provider value={{ socket, online, nickname, friendList }} >
      <UserListContext.Provider value={{ show, setShow, recipient, setRecipient, clicked, setClicked }} >

        {/* clicked -> used in Menu.jsx
    setClicked -> used in Online.jsx */}

        <div className='main'>
          {show && <Menu />}
          <Routes>
            <Route path='/' element={<Layout setUser={createSocketIdNameObject} />} />
            <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
            <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
            <Route path={`/game/${room}`} element={
              <Game
                sendMessage={sendMessage}
                sendPrivateMessage={privateMessage}
                sendData={sendData}
                setUser={createSocketIdNameObject}
                room={room}
                nickname={nickname}
                online={online}
                map={maps[room]}
              />} />
          </Routes>
        </div>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );

}
export default App;