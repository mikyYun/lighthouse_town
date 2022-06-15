import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
// import { socket, SocketContext, SOCKET_EVENT } from "./components/service/socket";
import Chat from "./components/Chat"
import ChatRoom from './components/ChatRoom';

import Cookies from 'universal-cookie';
// usehistory

// import Navbar from './components/Navbar';
import Sockets from './components/Sockets';
import Game from './components/Game';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';

const { io } = require("socket.io-client");

// import Navbar from './components/Navbar';



function App() {
  const navigate = useNavigate()

  // // 쿠키 세팅
  const [socket, setSocket] = useState();
  const cookies = new Cookies();
  let location = useLocation()
  useEffect(() => {
    // ga()
    console.log("location check", location.pathname)
    console.log(clearCookies)
    if (location.pathname !== "/game") clearCookies()
  }, [location.pathname])

  useEffect(() => {
    const socket = io();
    
    socket.on("CONNECT", (e) => {
      console.log("My socket ID",socket.id)
      console.log("CONNECTED", e);
    });

    socket.on("REGISTRATIPN SUCCESS", (userdame) => {
      console.log("cookie set after register")
      cookies.set("email", userdame);
      navigate("/game")
    });

    socket.on("PASS", (e) => {
      console.log(e)
    })

    socket.on("PRIVATE MESSAGE", (e) => {
      console.log(e)
    })

    setSocket(socket);
    return () => {
      socket.disconnect()
      // clearCookies()
    }; // => prevent memory leak..
  }, []);

  const RegistrationChecker = (val) => {
    console.log('ref');
    socket && socket.emit("REGISTERED", val);
  };

  const clearCookies = () => {
    const all_cookies = cookies.getAll();
    console.log("@@@@@@@", all_cookies)
    // if (all_cookies.length > 0) {
      Object.keys(all_cookies).forEach((each) => {
        console.log("each", each)
        cookies.remove(each);
      })
  };

  const createSocketIdNameObject = (username) => {
    socket && socket.emit("SET USERNAME", {"socketID": socket.id, "username": username} )
  }


  const sendMessage = () => {
    socket && socket.emit("NEW MESSAGE", socket.id)
  }

  const privateMessage = (target, msg) => {
    socket && socket.emit("PRIVATE MESSAGE", {"target": target, "message": msg, "senderID": socket.id})
  }
  return (

      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
        <Route path='/login' element={<Login setUser={createSocketIdNameObject}/>} />
        {/* <Route path='/login' element="Logout" /> */}
        {/* <Route path='/sockets' element={<Sockets />} /> */}
        <Route path='/game' element={<Game sendMessage={sendMessage} sendPrivateMessage={privateMessage}/>} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
  );



}

export default App;
