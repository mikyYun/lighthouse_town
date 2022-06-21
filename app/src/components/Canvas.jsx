import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import Characters from "./helper/Characters";
import { selectAvatar } from "./helper/selectAvatar";
import { SocketContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import { SOCKET_EVENT, makePublicMessage, makePrivateMessage, socket } from "./service/socket";


const Canvas = (props) => {
  const { socket, nickname } = useContext(SocketContext);
  const canvasRef = useRef(null);
  const location = useLocation();
  const [msg, setMsg] = useState({});
  const [userCharacters, setUserCharacters] = useState({
    [props.username]: new Characters({
      username: props.username,
      x: 60,
      y: 420,
      currentDirection: 0,
      frameCount: 0,
      avatar: props.avatar,
    }),
  });
  // console.log('username', props.username);
  // console.log('userCharacters', userCharacters)

  const navigate = useNavigate();
  const roomLists = {
    plaza: '/game/plaza',
    html: "/game/html",
    css: "/game/css",
    js: "/game/js",
    react: "/game/react",
    ruby: "/game/ruby",
  };

  // pathname changes -> add classname
  const path = location.pathname.split('/')[2];


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");


    // socket.on("connect", () => {
      // console.log('ITS CONNECTED!!!!!!')
      sendData()
      // console.log("SENT!!!!")
      // socket.emit("sendData", userCharacters[props.username].state);
      socket.on("sendData", (data) => {
        console.log("data", data);
        const newCharactersData = data;
        newCharactersData[props.username] = userCharacters[props.username];

        const newCharacters = { ...userCharacters };
        // set main user character
        newCharacters[props.username] = userCharacters[props.username];
        // console.log("before create New CHARACTERS", newCharacters)

        const allUsersState = data.usersInRooms[props.room];
        Object.keys(allUsersState).map(user => {
          // console.log(user)
          if (typeof user !== 'undefined') {
            if (user !== props.username) {
              newCharacters[user] = new Characters(allUsersState[user])
            }
          }
          // console.log("New CHARACTERS", newCharacters)
        });

        setUserCharacters(newCharacters);
        // console.log('AFTER SETTING: ', newCharacters)
      });

      for (const userChar in userCharacters) {
        // console.log('onfirts move',userChar)
        // console.log(userCharacters)
        userCharacters[userChar].drawFrame(ctx);
        userCharacters[userChar].showName(ctx);


        // Text on head.
        ctx.font = '20px monospace';
        ctx.fillText(
          userCharacters[userChar].state.username,
          userCharacters[userChar].state.x + 15,
          userCharacters[userChar].state.y + 10
          );
        ctx.fillStyle = "purple";
      }


    // });   //socket ends


    window.addEventListener("keydown", (e) => {
      userCharacters[props.username].move(e);
      setUserCharacters(userCharacters);
      sendData()

      // console.log(props.room, "BEFORE MOVING")

      // move to JS
      if (props.room === 'plaza') {
        // console.log("Im in Plaza")
        if (
          userCharacters[props.username].state.x >= 430 &&
          userCharacters[props.username].state.x <= 450 &&
          userCharacters[props.username].state.y >= 120 &&
          userCharacters[props.username].state.y <= 140
          ) {
            sendData(props.room);
            setUserCharacters({ ...userCharacters, [props.username]: undefined })
            handleRoom('js');
          }

        // move to Ruby
        if (
          userCharacters[props.username].state.x >= 710&&
          userCharacters[props.username].state.x <= 730 &&
          userCharacters[props.username].state.y >= 460 &&
          userCharacters[props.username].state.y <= 480
          ) {
            sendData(props.room);
            setUserCharacters({ ...userCharacters, [props.username]: undefined })
            handleRoom('ruby');
          }
      }
      // move to the Plaza
      if (props.room !== 'plaza') {
        // console.log("Im in LANG romm ")

        if (
          userCharacters[props.username].state.x <= 50 &&
          userCharacters[props.username].state.y >= 410 &&
          userCharacters[props.username].state.y <= 450
          ) {
            sendData(props.room);
            setUserCharacters({ ...userCharacters, [props.username]: undefined })
            handleRoom('plaza');
          }
      }

    });


    window.addEventListener("keyup", () => {
      // console.log()
      // userCharacters[props.username].stop();
      setUserCharacters(userCharacters)
      // console.log('after stop', userCharacters[props.username].state)
      if (userCharacters[props.username] !== undefined) {
        sendData();
      }
    });

    return () => {
      window.removeEventListener("keydown", (e) => userCharacters[0].move(e));
      window.removeEventListener("keyup", () => userCharacters[0].stop());
    };

  }, []);



  useEffect(() => {

    socket.on("dataToCanvas", data => {

      // when msg comes in, setMsg with its user
      // setTimeout for setMsg to be ""

        setMsg(prev => ({
          ...prev,
          [data.nickname]: data.content
        }))
        setTimeout(() => {
          setMsg(prev => ({
            ...prev,
            [data.nickname]: ""
          }))
        }, 7000);
    });
  }, [socket])



  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    // console.log('CHARACTER', userCharacters)
    // console.log('게임그릴때: ', msg)
      for (const userChar in userCharacters) {
        userCharacters[userChar].drawFrame(ctx);
        userCharacters[userChar].showName(ctx);
        const msgToShow = msg[userCharacters[userChar].state.username];
        // console.log(msgToShow);
        if (msgToShow !== undefined){
          userCharacters[userChar].showChat(ctx, msgToShow);
        }
      }


  }, [userCharacters]);




  //--------- functions
  // if user hit the specific position -> redirect to the page
  function handleRoom(room) {
    navigate(roomLists[room], { state: [props.username, props.avatar] });
  };

  // console.log('BEFORE FUNC', props.room)
  // sending data to server
  function sendData(removeFromRoom) {
    // console.log('Remove From Here', removeFromRoom)
    socket && socket.emit("sendData", {
      userState: userCharacters[props.username].state,
      room: props.room,
      removeFrom: removeFromRoom
    });
  };

  return (
    <div className={`game-container ${path}`}>
      <canvas className="game-canvas" ref={canvasRef} ></canvas>
    </div>
  );
};


export default Canvas;
