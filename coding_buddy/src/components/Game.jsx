import React from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Navbar from "./Navbar";
import Layout from "./Layout";


export default function Game(props) {
  console.log("game loading")
  console.log("GAME PROPS", props.sendPrivateMessage)
  // pass the mapimg as props
  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  return(
    <>
      <Layout />
      <Canvas sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage}/>
    </>
  );
}
