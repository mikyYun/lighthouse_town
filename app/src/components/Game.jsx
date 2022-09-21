import React, { useState, useEffect, useContext, useMemo } from "react";
import { SocketContext, UserListContext } from "../App";
import "./Game.scss";
import Cookies from "universal-cookie";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import Chat from "./Chat";
import Online from "./Online";
import FriendList from "./FriendsList";
// import Profile from "./Profile.jsx";

export default function Game(props) {
  const { socket } = useContext(SocketContext);
  const {userCookie} = useContext(UserListContext)
  const [recipient, setRecipient] = useState("all");
  const changeRecipient = (newRecipient) => {
    setRecipient(newRecipient);
  };

  useMemo(() => {

  }, [])

  return (

    <div className='main'>
      <Canvas changeRecipient={changeRecipient}/>
      <Chat recipient={recipient} changeRecipient={changeRecipient}/>
    </div>
  );
}
