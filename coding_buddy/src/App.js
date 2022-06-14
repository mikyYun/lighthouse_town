import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  // // 쿠키 세팅
  const [socket, setSocket] = useState();
  const cookies = new Cookies();
  useEffect(() => {
    const socket = io();

    socket.on("CONNECT", (e) => {
      console.log("CONNECTED", e);
    });

    setSocket(socket);
    return () => socket.disconnect(); // => prevent memory leak..
  }, []);
  // socket && socket.emit("REGISTERED", "HEY");

  const RegistrationChecker = (val) => {
    console.log('ref')
    socket && socket.emit("REGISTERED", val);
  };

  const loginHandler = (e) => {
    socket && socket.emit("LOGIN", e);
  };

  const setCookies = (e) => {
    socket && socket.emit("SET COOKIES");
  };
  const clearCookies = (e) => {
    const all_cookies = cookies.getAll();
    if (all_cookies.length > 0) {
      all_cookies.forEach((each) => {
        cookies.remove(each, { path: "/" });
      });
    } else {
      console.log("No Cookies");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout click={() => clearCookies()} />} />
        <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker}/>} click={() => clearCookies()} />
        <Route path='/login' element={<Login click={() => clearCookies()}/>} />
        {/* <Route path='/login' element="Logout" /> */}
        <Route path='/sockets' element={<Sockets click={() => clearCookies()}/>} />
        <Route path='/game' element={<Game click={() => clearCookies()}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
