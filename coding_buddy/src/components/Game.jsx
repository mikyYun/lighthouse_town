import React, { useEffect, ReactDOM, useContext } from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Chat from "./Chat";
import Online from "./Online";

import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../App";
export default function Game(props) {
  const navigate = useNavigate()
  // const {username} = useContext(SocketContext)
  // let loggedIn = false
  // const setUser = props.setUser
  // sendData function from props => props.sendData
  // console.log("game loading")
  // pass the mapimg as props
  // console.log("GAME PROPS", props.sendPrivateMessage)
  // pass the mapimg as props

  // @@ Moon: 이거 위에서 destructuring 으로 할수있지않나? 아니면 Context로
  const sendMessage = props.sendessage
  const sendPrivateMessage = props.sendPrivateMessage

  // const getAllUsers = props.getAllUsers
  // getAllUsers()
  const location = useLocation();
  // useEffect(() => {
  //   if (location.state === null) navigate("/")
  // }, [])
  // useEffect(() => {
  // console.log("LOCATION", location.state)
  // if (location.state == null) navigate("/")
  // })
  // console.log('inside game',location.state)  //username
  // console.log('inside game',location.state.userName)  //username
  // if (location.state === null) alert("hey")

  // if (location.state !== null) {

  console.log("location", location)
  return (
    <>
      <div className="main-container">
        {/* {(location.state === null) && navigate("/")} */}
        {/* <Canvas username={location.state[0] || 'guest'} avatar={location.state[1]} sendData={props.sendData} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} room={props.room} /> */}
        <Canvas username={props.nickname} avatar={location.state?.[1]} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} room={props.room} sendData={props.sendData} />
        <Chat username={props.nickname} room={props.room} handleSubmitNickname={props.handleSubmitNickname} nickname={props.nickname}
        />
        <Online online={props.online} />
      </div>
    </>
  );
}
