import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import { socket, SocketContext, SOCKET_EVENT } from "./components/service/socket";
import Chat from "./components/Chat"

// import Cookies from 'universal-cookie';
// usehistory

// import Navbar from './components/Navbar';
// import Sockets from './components/Sockets';
import Game from './components/Game';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';


function App() {
  // // 쿠키 세팅
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/login' element="Logout" /> */}
        {/* <Route path='/sockets' element={<Sockets />} /> */}
        <Route path='/game' element={<Game />} />
        <Route path='/chat' element={<Chat />} />

      </Routes>
    </BrowserRouter>
  );



}

export default App;
