import React from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Navbar from "./Navbar";
import Layout from "./Layout";
import Chat from "./Chat";
import { useLocation } from "react-router-dom";


export default function Game() {
  // console.log("game loading")
  // pass the mapimg as props

  const location = useLocation();
  // console.log('inside game',location.state)  //username

  return(
    <>
      {/* <Layout /> */}
      <div className="main-container">
        <Canvas username={location.state}/>
        <Chat username={location.state}/>
      </div>
    </>
  );
}
