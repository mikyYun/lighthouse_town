import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Cookies from 'universal-cookie'


// import Navbar from './components/Navbar';
import Sockets from './components/Sockets';
import Game from './components/Game';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';



function App() {
  // 쿠키 세팅
  // const cookies = new Cookies();
  // cookies.set("test", "test11", {path: '/'})
  // console.log(cookies.get('test'))
  // 쿠키 삭제 테스트
  // document.addEventListener("click", () => {
    // cookies.remove("test")
    // console.log(cookies.get('test'))
  // })
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {/* <Route path='/login' element="Logout" /> */}
        <Route path='/sockets' element={<Sockets />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
