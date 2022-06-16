import React from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Chat from "./Chat";
import { useLocation } from "react-router-dom";
export default function Game(props) {

  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  const location = useLocation();

  console.log("LOCATION", location)
  console.log("LOCATION.STATE", location.state)
  console.log('game props', props)

  return (
    <>
      {/* <Layout /> */}
      <div className="main-container">
        <Canvas username={location.state?.[0] || 'heesoo'} avatar={location.state?.[1] || 1} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} room={props.room} />
        <Chat username={location.state} room={props.room} handleSubmitNickname={props.handleSubmitNickname} nickname={props.nickname} />
      </div>
    </>
  );
}
