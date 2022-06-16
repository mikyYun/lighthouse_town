import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
// import { socket, SocketContext, SOCKET_EVENT } from "./components/service/socket";
import Chat from "./components/Chat"

import Cookies from 'universal-cookie';
// usehistory

// import Navbar from './components/Navbar';
// import Sockets from './components/Sockets';
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
  const [room, setRoom] = useState('plaza');




  let location = useLocation()
  useEffect(() => {
    // ga()
    setRoom(location.pathname.split("/").splice(2)[0])
    console.log('room after split and slice', room)
    console.log("LOCATION.PATHNAME", location.pathname)

    const cookies = new Cookies();

    const clearCookies = () => {
      const all_cookies = cookies.getAll();
      // if (all_cookies.length > 0) {
      Object.keys(all_cookies).forEach((each) => {
        console.log("each", each)
        cookies.remove(each);
      })
    };

    if (location.pathname !== "/game") clearCookies()
  }, [location.pathname, room])

  useEffect(() => {
    const socket = io("/");
    const cookies = new Cookies();

    socket.on("CONNECT", (e) => {
      console.log("My socket ID", socket.id)
      console.log("CONNECTED", e);
    });

    socket.on("REGISTRATIPN SUCCESS", (username) => {
      console.log("cookie set after register")
      cookies.set("email", username);
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



  const createSocketIdNameObject = (username) => {
    socket && socket.emit("SET USERNAME", { "socketID": socket.id, "username": username })
  }


  const sendMessage = () => {
    socket && socket.emit("NEW MESSAGE", socket.id)
  }

  const privateMessage = (target, msg, username) => {
    socket && socket.emit("PRIVATE MESSAGE", { "target": target, "message": msg, "username": username })
  }

  return (
    <div className='main'>
      <Routes>
        <Route path='/' element={<Layout setUser={createSocketIdNameObject} />} />
        <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
        <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
        {/* <Route path='/login' element="Logout" /> */}
        {/* <Route path='/sockets' element={<Sockets />} /> */}
        <Route path='/game' element={<Game sendMessage={sendMessage} sendPrivateMessage={privateMessage} room={room} />} />

        {/* <Route path={`/game/${room}`} element={<Chat room={room} />} /> */}
        <Route path={`/game/${room}`}
          element={<Game sendMessage={sendMessage} sendPrivateMessage={privateMessage} />}
        />
      </Routes>
    </div>
  );
}

export default App;
