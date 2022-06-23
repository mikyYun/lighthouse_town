import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../App";
import Canvas from "./Canvas";
import "./Game.scss";
import Chat from "./Chat";
import Online from "./Online";
import Profile from "./Profile.jsx";

import { useLocation } from "react-router-dom";
import FriendList from "./FriendsList";

export default function Game(props) {
  const location = useLocation();
  const { nickname, socket } = useContext(SocketContext);
  const [msg, setMsg] = useState({});

  console.log('location', location);


  // useEffect(() => {
  //   socket.on("connect", () => {
  //     socket.emit("SET USERNAME", { "socketID": socket.id, "username": nickname });
  //   })

  //   return (() => {
  //     socket.disconnect()
  //   })
  // }, [])

  // const {username} = useContext(SocketContext)
  // let loggedIn = false
  // const setUser = props.setUser
  // sendData function from props => props.sendData
  // console.log("game loading")
  // pass the mapimg as props
  // console.log("GAME PROPS", props.sendPrivateMessage)
  // pass the mapimg as props

  // @@ Moon: 이거 위에서 destructuring 으로 할수있지않나? 아니면 Context로
  const sendMessage = props.sendessage;
  const sendPrivateMessage = props.sendPrivateMessage;

  // const getAllUsers = props.getAllUsers
  // getAllUsers()
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

  const [show, setShow] = useState(false);
  const [lecture, setLecture] = useState("https://www.youtube.com/embed/FSs_JYwnAdI" );
  const [url, setUrl] = useState("");
  const showLecture = () => {
    setShow(!show);
  }


//   https://youtu.be/9wH52VWqsT4
// avatar moon to all: https://www.youtube.com/embed/9wH52VWqsT4
  // const changeLecture = () => {
  //   const address = url.split('=')[1]
  //   console.log(address);
  //   setLecture('https://www.youtube.com/embed/' + address)
  // }

  function sendUrl(url){
    console.log(socket);
    socket && socket.emit("lecture", url);
    console.log("SENT")
  }

useEffect(() => {
    socket.on("new lecture", data => {
      console.log(data)
      setLecture(data)
    })
},[socket])
  // const updateLecture = () => {
  //   socket.emit("lecture", url);
  // }


  return (

    <div className='main'>

      <div className="main-container">
        {/* {(location.state === null) && navigate("/")} */}
        {/* <Canvas username={location.state[0] || 'guest'} avatar={location.state[1]} sendData={props.sendData} sendMessage={sendMessage} sendPrivateMessage={sendPrivateMessage} room={props.room} /> */}
        <div className="lecture-container">
          { location.pathname === '/game/js' && <button className="lecture-btn" onClick={showLecture}>LECTURE</button>}
          { show && <div className="lecture">
            <iframe width="560" height="315" src={lecture} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            <div>
              <input className="lecture-input" type="text" placeholder="YOUTUDE URL" onKeyUp={e => setUrl(e.target.value)}></input>
              <button className="input-btn" onClick={() => {sendUrl(url)}}>UPLOAD</button>
            </div>
          </div>}
        </div>
        <Canvas
          username={nickname}
          // avatar={location.state?.[1]}
          avatar={location.state?.[1]}
          sendMessage={sendMessage}
          sendPrivateMessage={sendPrivateMessage}
          room={props.room}
          sendData={props.sendData}
          map={props.map}
        />
        <Chat
          username={props.username}
          room={props.room}
          handleSubmitNickname={props.handleSubmitNickname}
          // nickname={props.username}
        />
      </div>
      <div className="side-bar">
          <FriendList />
          <Online />
        </div>
    </div>
  );
}
