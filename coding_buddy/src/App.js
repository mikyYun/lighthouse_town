import React , {useContext } from 'react';
import './App.css';

import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import { socket, SocketContext, SOCKET_EVENT } from "./components/service/socket";
import Chat from "./components/Chat";
import { SocketContext } from './components/service/socket';
import Cookies from 'universal-cookie';
import Game from './components/Game';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
// import {} from './components/service/socket'
// const { io } = require("socket.io-client");

function App() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext)
  // // 쿠키 세팅
  // const [socket, setSocket] = useState();
  const [room, setRoom] = useState('plaza');
  const [nickname, setNickname] = useState('')
  const cookies = new Cookies();
  let location = useLocation();
  useEffect(() => {
    setRoom(location.pathname.split("/").splice(2)[0])
    // ga()
    console.log("location check", location.pathname);
    console.log(clearCookies);
    if (location.pathname !== "/game") clearCookies();
  }, [location.pathname]);

  useEffect(() => {
    // const socket = io();

    socket.on("connect", () => {
      console.log("App.js: socket server connected.");
      console.log("My socket ID", socket.id);
      console.log("CONNECTED");
    });

    socket.on("REGISTRATIPN SUCCESS", (username) => {
      console.log("cookie set after register");
      cookies.set("email", username);
      console.log("username", username)
      navigate("/game");
    });

    socket.on("PASS", (e) => {
      console.log(e);
    });

    socket.on("PRIVATE MESSAGE", (e) => {
      console.log(e);
    });

    socket.on("init", msg => console.log("msg", msg))
    socket.on("backData", data => console.log("data", data))

    // socket.on("all user names", (obj) => {
    //   console.log("지금 로그인 되어있는 유저", obj.users)
    // })
    // console.log("BEFOER ALL")
    socket.on("all user names", (obj) => {
      // alert(JSON.stringify(obj.users))
        // alert(JSON.stringify(obj.users))
        console.log("지금 로그인 되어있는 유저 - obj.users (App.js)", obj.users)
        // obj.users = ['name']
        obj.users.forEach(name => {
          const valueAndLabel = {"value": name, "label": name}
          setOptions(prev => [...prev, valueAndLabel])
        })

    })


    // socket.on('sendData', data => {
    //   console.log('data', data);
    //   setUsersPosition(data);
    // })

    // setSocket(socket);
    return () => {
      socket.disconnect();
      // clearCookies()
    }; // => prevent memory leak..
  }, []);

  const RegistrationChecker = (val) => {
    console.log('ref');
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

  // const getAllUsers = () => {
  //   socket && socket.on("all user names", (obj) => {
  //     console.log("지금 로그인 되어있는 유저", obj.users)
  //   })
  // }
  //////////////////////////////////////////////
  // socket update
  // const { io } = require("socket.io-client");

  const sendData = (state) => {
    socket && socket.emit("sendData", state)
    // socket && socket.emit("PRIVATE MESSAGE", { "target": target, "message": msg, "username": username })
  }
  ////////////////////////////////////////////////////
  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<Layout setUser={createSocketIdNameObject} />} />
        <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
        <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
        {/* <Route path='/login' element="Logout" /> */}
        {/* <Route path='/sockets' element={<Sockets />} /> */}
        <Route path='/game' element={<Game sendMessage={sendMessage} sendPrivateMessage={privateMessage} sendData={sendData} setUser={createSocketIdNameObject} room={room} nickname={nickname} />} />
        <Route path='/chat' element={<Chat />} />
        <Route path={`/game/${room}`} element={<Game sendMessage={sendMessage} sendPrivateMessage={privateMessage} />} />
      </Routes>
    </div>
  );

}
export default App;
