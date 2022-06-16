import React, {useEffect} from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Navbar from "./Navbar";
import Layout from "./Layout";
import Chat from "./Chat";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";


export default function Game(props) {
  const navigate = useNavigate()
  // let loggedIn = false
  const setUser = props.setUser
  // sendData function from props => props.sendData
  // console.log("game loading")
  // pass the mapimg as props
  // console.log("GAME PROPS", props.sendPrivateMessage)
  // pass the mapimg as props
  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  // const getAllUsers = props.getAllUsers
  // getAllUsers()
  const location = useLocation();
  useEffect(() => {
    if (location.state === null) navigate("/")
  })
  // useEffect(() => {
    // console.log("LOCATION", location.state)
    // if (location.state == null) navigate("/")
  // })
  // console.log('inside game',location.state)  //username
  // console.log('inside game',location.state.userName)  //username
  // if (location.state === null) alert("hey")
  if (location.state !== null) {
    return (
      <>
        {/* <Layout /> */}
        <div className="main-container">
          {/* {(location.state === null) && navigate("/")} */}
          <Canvas username={location.state[0]} avatar={location.state[1]} sendData={props.sendData} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} />
          <Chat username={location.state} />
        </div>
      </>
    );
  } 
  else {
    return (
      <Routes>
        <Route path="/" />
      </Routes>
    )
  }
}
