import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Sockets from './components/Sockets';
import Game from './components/Game';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}/>
        <Route path='/sockets' element={<Sockets />}/>
        <Route path='/game' element={<Game />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
