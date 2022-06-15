import React from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";
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
      console.log("CONNECTED", e);
    });

    socket.on("REGISTRATIPN SUCCESS", (userdame) => {
      console.log("cookie set after register")
      cookies.set("email", userdame);
      navigate("/game")
    });

    setSocket(socket);
    return () => {
      socket.disconnect()
      clearCookies()
    }; // => prevent memory leak..
  }, []);
  // socket && socket.emit("REGISTERED", "HEY");

  const RegistrationChecker = (val) => {
    console.log('ref');
    socket && socket.emit("REGISTERED", val);
  };

  const loginHandler = (e) => {
    socket && socket.emit("LOGIN", e);
  };

  const setCookies = (e) => {
    socket && socket.emit("SET COOKIES");
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

  return (

      <Routes>
        <Route path='/' element={<Layout click={() => clearCookies()} />} />
        <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} click={() => clearCookies()} />
        <Route path='/login' element={<Login click={() => clearCookies()} />} />
        {/* <Route path='/login' element="Logout" /> */}
        <Route path='/sockets' element={<Sockets click={() => clearCookies()} />} />
        <Route path='/game' element={<Game />} />
      </Routes>
  );
}

export default App;
