import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import { selectAvatar } from "./helper/selectAvatar";
import { SocketContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import { SOCKET_EVENT, makePublicMessage, makePrivateMessage } from "./service/socket";


const Canvas = (props) => {
  const { socket, nickname } = useContext(SocketContext);
  const canvasRef = useRef(null);
  const location = useLocation();
  const [userCharacters, setUserCharacters] = useState({
    [props.username]: new Characters({
      username: props.username,
      x: 150,
      y: 150,
      currentDirection: 0,
      frameCount: 0,
      avatar: props.avatar,
    }),
  });
  console.log('username', props.username);
  console.log('userCharacters', userCharacters)

  const navigate = useNavigate();
  const roomLists = {
    html: "/game/html",
    css: "/game/css",
    javascript: "/game/js",
    react: "/game/react",
    ruby: "/game/ruby",
  };

  // pathname changes -> add classname
  const path = location.pathname.split('/')[2];


  useEffect(() => {

    socket.on("connect", () => {
      const canvas = canvasRef.current;
      canvas.width = 1120;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");

      // const mapImg = new Image();
      // mapImg.src = props.map;
      // mapImg.onload = () => {
        // ctx.drawImage(mapImg, 0, 0);

        for (const userChar in userCharacters) {
          console.log('onfirts move',userChar)
          // console.log(userCharacters)
          userCharacters[userChar].drawFrame(ctx);

          // Text on head.
          ctx.font = '20px monospace';
          ctx.fillText(
            userCharacters[userChar].state.username,
            userCharacters[userChar].state.x + 15,
            userCharacters[userChar].state.y + 10
            );
          ctx.fillStyle = "purple";
        }
      // }
      sendData()
      // socket.emit("sendData", userCharacters[props.username].state);
      socket.on("sendData", (data) => {
        // console.log("data", data);
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
    });

    window.addEventListener("keydown", (e) => {
      console.log("will move")
      userCharacters[props.username].move(e);
      setUserCharacters(userCharacters);
      console.log('will send data')
      sendData()
      console.log('sent!')

      // move to the JS room
      if (
        userCharacters[props.username].state.x >= 420 &&
        userCharacters[props.username].state.x <= 460 &&
        userCharacters[props.username].state.y >= 120 &&
        userCharacters[props.username].state.y <= 140
      ) {

        setUserCharacters({ ...userCharacters, [props.username]: undefined })
        // console.log('after remove', userCharacters)
        handleRoom();
        sendData(props.room);
      }
      // sendData();
      // socket.emit("sendData", userCharacters[props.username].state);
    });

    window.addEventListener("keyup", () => {
      // console.log()
      userCharacters[props.username].stop();
      // socket.emit("sendData", userCharacters[props.username].state);
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
    const canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    // const mapImg = new Image();
    // mapImg.src = props.map;
    // mapImg.onload = () => {
      // ctx.drawImage(mapImg, 0, 0);
      for (const userChar in userCharacters) {
        userCharacters[userChar].drawFrame(ctx);

        // Text on head.
        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = "black";
        ctx.fillRect(
          userCharacters[userChar].state.x,
          userCharacters[userChar].state.y - 10,
          80,
          20
          )
        ctx.fillStyle = "white";
        ctx.fillText(
          userCharacters[userChar].state.username,
          userCharacters[userChar].state.x + 10,
          userCharacters[userChar].state.y + 5
          )

        }
      // }
  }, [userCharacters]);


  //--------- functions
  // if user hit the specific position -> redirect to the page
  function handleRoom() {
    navigate(roomLists.javascript, { state: [props.username, props.avatar] });
  };

  // sending data to server
  function sendData(removeFromRoom) {
    socket.emit("sendData", {
      userState: userCharacters[props.username].state,
      room: props.room,
      removeFrom: removeFromRoom
    });
  };

  // const handleMessage = useCallback(
  //   (pondata) => {
  //     const message =
  //   }
  // )

  // }
  // console.log("LAST", userCharacters)
  return (
    <div className={`game-container ${path}`}>
      <canvas className="game-canvas" ref={canvasRef} ></canvas>
    </div>
  );
};


export default Canvas;
