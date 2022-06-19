import React, { useEffect, useRef, useState, useContext } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import { selectAvatar } from "./helper/selectAvatar";
import { SocketContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

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
      avatar: 1,
    }),
  });

  const navigate = useNavigate();
  const roomLists = {
    html: "/game/html",
    css: "/game/css",
    javascript: "/game/js",
    react: "/game/react",
    ruby: "/game/ruby",
  };
  // console.log("username", props.username);
  // console.log("nickName", nickname);
  // console.log('userCharacters', userCharacters)

  // sending data to server
  const sendData = (removeFromRoom) => {
    socket.emit("sendData", {
      userState: userCharacters[props.username].state,
      room: props.room,
      removeFrom: removeFromRoom
    });
  }

  useEffect(() => {
    socket.on("connect", () => {
      const canvas = canvasRef.current;
      canvas.width = 1120;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");

      const mapImg = new Image();
      mapImg.src = props.map;
      mapImg.onload = () => {
        ctx.drawImage(mapImg, 0, 0);
        for (const userChar in userCharacters) {
          // console.log(userChar)
          // console.log(userCharacters)
          userCharacters[userChar].drawFrame(ctx);

          // Text on head.
          ctx.fillText(
            userCharacters[userChar].state.username,
            userCharacters[userChar].state.x + 20,
            userCharacters[userChar].state.y + 10
          );
          ctx.fillStyle = "purple";
        }
      }
      sendData()
      // socket.emit("sendData", userCharacters[props.username].state);
    });

    // data = {
    //   {
    //     "usersInRooms": {
    //         "plaza": {
    //             "moon": {
    //                 "username": "moon",
    //                 "x": 158,
    //                 "y": 150,
    //                 "currentDirection": 2,
    //                 "frameCount": 0,
    //                 "avatar": 1
    //             },
    //             "heesoo": {
    //                 "username": "heesoo",
    //                 "x": 150,
    //                 "y": 150,
    //                 "currentDirection": 0,
    //                 "frameCount": 0,
    //                 "avatar": 1
    //             }
    //         }
    //     },
    //     "room":        "plaza"

    // }

    // userCharacters = {
    //     "moon": Characters()


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


    window.addEventListener("keydown", (e) => {
      userCharacters[props.username].move(e);
      sendData()

      // move to the JS room
      if (
        userCharacters[props.username].state.x >= 420 &&
        userCharacters[props.username].state.x <= 460 &&
        userCharacters[props.username].state.y >= 120 &&
        userCharacters[props.username].state.y <= 140
      ) {
        // console.log("IM here!!!!!!")
        // setUserCharacters( prev => {
        //   const copy = {...prev};
        //   delete copy[props.username]
        //   return copy
        // })

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

    const mapImg = new Image();
    mapImg.src = props.map;
    mapImg.onload = () => {

      ctx.drawImage(mapImg, 0, 0);

      for (const userChar in userCharacters) {
        // console.log(userChar);
        // console.log(userCharacters);
        userCharacters[userChar].drawFrame(ctx);

        // Text on head.
        ctx.fillText(
          userCharacters[userChar].state.username,
          userCharacters[userChar].state.x + 20,
          userCharacters[userChar].state.y + 10
        );
        ctx.fillStyle = "purple";
        // console.log("ROOM", userCharacters);
      }
    }
  }, [userCharacters]);

  // if user hit the specific position -> redirect to the page
  function handleRoom() {
    navigate(roomLists.javascript, { state: props.username });
  }


  // console.log("LAST", userCharacters)
  return (
    <div className="game-container">
      <canvas className="game-canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;
