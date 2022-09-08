import React, { useState, useEffect, useContext } from "react";
import { SocketContext, UserListContext } from "../App_backup";
import Canvas from "./Canvas";
import "./Game.scss";
import Chat from "./Chat";
import Online from "./Online";
import Profile from "./Profile.jsx";

import { useLocation } from "react-router-dom";
import FriendList from "./FriendsList";

export default function Game(props) {
  const location = useLocation();
  const { socket } = useContext(SocketContext);
  const { nickname } = useContext(UserListContext);
  const { sendMessage, sendPrivateMessage } = props
  const [msg, setMsg] = useState({});

  // console.log('location', location);

  const [show, setShow] = useState(false);
  const [lecture, setLecture] = useState("https://www.youtube.com/embed/FSs_JYwnAdI" );
  const [url, setUrl] = useState("");
  const showLecture = () => {
    setShow(!show);
  }

  function sendUrl(url){
    // console.log(socket);
    socket && socket.emit("lecture", url);
    // console.log("SENT")
  }

useEffect(() => {
    socket.on("new lecture", data => {
      // console.log(data)
      setLecture(data)
    })
},[socket])
  return (

    <div className='main'>

      <div className="main-container">
        <div className="lecture-container">
          { location.pathname === '/game/js' && <button className="lecture-btn" onClick={showLecture}>LECTURE</button>}
          { show && <div className="lecture">
            <iframe width="560" height="315" src={lecture} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            <div>
              <input className="lecture-input" type="text" placeholder="YOUTUBE URL" onKeyUp={e => setUrl(e.target.value)}></input>
              <button className="input-btn" onClick={() => {sendUrl(url)}}>UPLOAD</button>
            </div>
          </div>}
        </div>
        <Canvas
          username={nickname}
          avatar={location.state?.[1]}
          sendMessage={sendMessage}
          sendPrivateMessage={sendPrivateMessage}
          room={props.room}
          map={props.map}
        />
        <Chat
          username={nickname}
          room={props.room}
          handleSubmitNickname={props.handleSubmitNickname}
        />
      </div>
      <div className="side-bar">
          <FriendList />
          <Online />
        </div>
    </div>
  );
}
