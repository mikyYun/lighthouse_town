import React from "react";
import Canvas from "./Canvas";
import Recipient from "./Recipient";
import NicknameForm from "./NicknameForm"
import "./Game.scss";
// import Navbar from "./Navbar";
// import Layout from "./Layout";
import Chat from "./Chat";
import { useLocation } from "react-router-dom";
import { useState, useCallback, useRef } from "react";


export default function Game(props) {
  // console.log("game loading")
  // pass the mapimg as props
  // console.log("GAME PROPS", props.sendPrivateMessage)
  // pass the mapimg as props
  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  const location = useLocation();
  // console.log('inside game',location.state)  //username
  // console.log('inside game',location.state.userName)  //username

  console.log("LOCATION", location)
  console.log("LOCATION.STATE", location.state)


  const prevNickname = useRef(null); // prevNickname 변경은 컴포넌트를 리렌더링 하지않습니다.
  const [nickname, setNickname] = useState(props.username);
  const handleSubmitNickname = useCallback(newNickname => {
    prevNickname.current = nickname;
    setNickname(newNickname);
  }, [nickname]);
  return (
    <>
      {/* <Layout /> */}
      <div className="main-container">
        <Canvas username={location.state?.[0] || 'heesoo'} avatar={location.state?.[1] || 1} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} room={props.room} />
        <Chat username={location.state} room={props.room} handleSubmitNickname={handleSubmitNickname} nickname={nickname} />
      </div>
    </>
  );
}
