import cameraControl from "./helper/cameraControl";
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import Characters from "./helper/Characters";
import { SocketContext, UserListContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
const ScreenSizeDetector = require("screen-size-detector");

const Canvas = () => {
  const { socket } = useContext(SocketContext);
  const [username, setUsername] = useState();
  const canvasRef = useRef(null);
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [msg, setMsg] = useState({});
  const [userCharacters, setUserCharacters] = useState({});
  const [cameraPosition, setCameraPosition] = useState({
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();
  const screen = new ScreenSizeDetector();
  // const horCenter = (screen.width - 63.5) / 2;
  // const verCenter = (screen.height - 63.5) / 2;
  
  
  let canvas;
  // const canvas = canvasRef.current;
  // canvas.width = 1120;
  // canvas.height = 640;
  // console.log("TEST")
  // const ctx = canvas.getContext("2d");
  useMemo(() => {
    const cookies = new Cookies();
    const allCookies = cookies.getAll();
    if (!allCookies.userData) {
      navigate("/")
    }
    const userData = allCookies.userdata;
    setUsername(userData.userName);
    const avatar = userData.avatar;
    const startingPosition = { x: 200, y: 420 };

    setUserCharacters({
      [userData.userName]: new Characters({
        username: userData.userName,
        x: startingPosition.x,
        y: startingPosition.y,
        currentDirection: 0,
        frameCount: 0,
        avatar,
      }),
    });
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const keyCode = e.keyCode;
      userCharacters[username]?.move(keyCode);
      // console.log("AVATARPOSITION", userCharacters[username].state.x);
      console.log()
      cameraControl(keyCode, setCameraPosition, screen, userCharacters, username);

      setUserCharacters((prev) => ({
        ...prev,
        [username]: prev[username],
      }));
      // canvas = canvasRef.current;
      // const ctx = canvas.getContext("2d");
      // userCharacters[username].drawFrame(ctx);
      // userCharacters[username].showName(ctx);
      // userCharacters[username].drawFrame(ctx);
      // userCharacters[username].showName(ctx);
    });
    document.addEventListener("keyup", (e) => {
      const keyCode = e.keyCode;
      userCharacters[username]?.stop(keyCode);
      setUserCharacters((prev) => ({
        ...prev,
        [username]: prev[username],
      }));
    });
    return () => {
      document.removeEventListener("keydown");
      document.removeEventListener("keyup");
    };
  }, []);

  // const userDataInCookies = allCookies.userdata
  // const navigate = useNavigate();
  // const roomLists = {
  //   plaza: '/game/plaza',
  //   html: "/game/html",
  //   css: "/game/css",
  //   js: "/game/js",
  //   react: "/game/react",
  //   ruby: "/game/ruby",
  // };

  // // pathname changes -> add classname

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   canvas.width = 1120;
  //   canvas.height = 640;
  //   const ctx = canvas.getContext("2d");

  //   //join to chat room
  //   socket.emit('JOIN_ROOM', [props.username,path])

  //     sendData()
  //     socket.on("sendData", (data) => {
  //       const newCharactersData = data;
  //       newCharactersData[props.username] = userCharacters[props.username];

  //       const newCharacters = { ...userCharacters };
  //       // set main user character
  //       newCharacters[props.username] = userCharacters[props.username];
  //       // console.log("before create New CHARACTERS", newCharacters)

  //       const allUsersState = data.usersInRooms[props.room];
  //       Object.keys(allUsersState).map(user => {
  //         // console.log(user)
  //         if (typeof user !== 'undefined') {
  //           if (user !== props.username) {
  //             newCharacters[user] = new Characters(allUsersState[user])
  //           }
  //         }
  //       }
  //       // console.log("New CHARACTERS", newCharacters)
  //     );

  //     setUserCharacters(newCharacters);
  //     // console.log('AFTER SETTING: ', newCharacters)
  //   });

  //   for (const userChar in userCharacters) {
  //     userCharacters[userChar].drawFrame(ctx);
  //     userCharacters[userChar].showName(ctx);

  //     // Text on head.
  //     ctx.font = '20px monospace';
  //     ctx.fillText(
  //       userCharacters[userChar].state.username,
  //       userCharacters[userChar].state.x + 15,
  //       userCharacters[userChar].state.y + 10
  //     );
  //     ctx.fillStyle = "purple";
  //   }

  //   // });   //socket ends

  // useEffect(() => {

  // window.addEventListener("keydown", (e) => {
  //   userCharacters[username].move(e.keyCode);
  //   console.log(userCharacters[username].state);
  //   setUserCharacters(userCharacters);
  //   console.log(userCharacters);
  // });
  // window.addEventListener("keyup", (e) => {
  //   // userCharacters[username].move(e.keyCode);
  //   // setUserCharacters(userCharacters);
  //   if (userCharacters[username] !== undefined) {
  //     // sendData();
  //   }
  // });

  // return () => {
  // console.log("EVENTLISTENER RETURN")
  // window.removeEventListener("keydown", (e) => {
  // const keyCode = e.keyCode;
  // userCharacters[username].move(keyCode);
  // setUserCharacters(userCharacters)
  // })
  // controlAvatar();
  // window.removeEventListener("keydown", (e) =>
  //   userCharacters[0].move(e.keyCode)
  // );
  // window.removeEventListener("keyup", () => userCharacters[0].stop());
  // };
  // }, []);
  //     sendData()

  //     // move to JS
  //     if (props.room === 'plaza') {
  //       // console.log("Im in Plaza")
  //       if (
  //         userCharacters[props.username].state.x >= 420 &&
  //         userCharacters[props.username].state.x <= 460 &&
  //         userCharacters[props.username].state.y >= 120 &&
  //         userCharacters[props.username].state.y <= 140
  //       ) {
  //         sendData(props.room);
  //         setUserCharacters({ ...userCharacters, [props.username]: undefined })
  //         handleRoom('js');
  //       }

  //       // move to Ruby
  //       if (
  //         userCharacters[props.username].state.x >= 710&&
  //         userCharacters[props.username].state.x <= 770 &&
  //         userCharacters[props.username].state.y >= 430 &&
  //         userCharacters[props.username].state.y <= 470
  //         ) {
  //           sendData(props.room);
  //           setUserCharacters({ ...userCharacters, [props.username]: undefined })
  //           handleRoom('ruby');
  //         }
  //     }
  //     // move to the Plaza
  //     if (props.room !== 'plaza') {
  //       // console.log("Im in LANG romm ")

  //       if (
  //         userCharacters[props.username].state.x <= 50 &&
  //         userCharacters[props.username].state.y >= 410 &&
  //         userCharacters[props.username].state.y <= 450
  //       ) {
  //         sendData(props.room);
  //         setUserCharacters({ ...userCharacters, [props.username]: undefined })
  //         handleRoom('plaza');
  //       }
  //     }

  //   });

  //   window.addEventListener("keyup", () => {
  //     setUserCharacters(userCharacters)
  //     if (userCharacters[props.username] !== undefined) {
  //       sendData();
  //     }
  //   });

  //   return () => {
  //     window.removeEventListener("keydown", (e) => userCharacters[0].move(e));
  //     window.removeEventListener("keyup", () => userCharacters[0].stop());
  //   };

  // }, []);

  // useEffect(() => {

  //   socket.on("dataToCanvas", data => {

  //     // when msg comes in, setMsg with its user
  //     // setTimeout for setMsg to be ""

  //     setMsg(prev => ({
  //       ...prev,
  //       [data.nickname]: data.content
  //     }))
  //     setTimeout(() => {
  //       setMsg(prev => ({
  //         ...prev,
  //         [data.nickname]: ""
  //       }))
  //     }, 7000);
  //   });
  // }, [socket])

  useEffect(() => {
    const initialMapHeight = (screenHeight) => {
      if (screenHeight < 640) {
        return 640 - screenHeight;
      }
    };

    setCameraPosition((prev) => ({
      ...prev,
      y: initialMapHeight(screen.height),
      // y : -150,
    }));
    console.log(cameraPosition)
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    userCharacters[username].drawFrame(ctx);
    userCharacters[username].showName(ctx);
    // for (const userChar in userCharacters) {
    //   userCharacters[userChar].drawFrame(ctx);
    //   userCharacters[userChar].showName(ctx);
    //   const msgToShow = msg[userCharacters[userChar].state.username];
    //   if (msgToShow !== undefined) {
    //     // userCharacters[userChar].showBubble(ctx);
    //     userCharacters[userChar].showChat(ctx, msgToShow);
    //   }
    // }
    // document.addEventListener("keydown", (e) => {
    // const code = e.keyCode;
    // userCharacters[username]?.move(code);

    // setUserCharacters(prev => ({...prev, [username]: }))
    // });
  }, [userCharacters]);
  // //--------- functions
  // // if user hit the specific position -> redirect to the page
  // function handleRoom(room) {
  //   // userDataInCookies
  //   // navigate(roomLists[room], { state: [props.username, props.avatar] });
  //   const userLanguages = userDataInCookies.userLanguages
  //   const userID = userDataInCookies.id
  //   navigate(roomLists[room], { state: [props.username, props.avatar, userLanguages, userID] });
  //   navigate(0, { state: [props.username, props.avatar, userLanguages, userID] })
  // };

  // function sendData(removeFromRoom) {
  //   socket && socket.emit("sendData", {
  //     userState: userCharacters[props.username].state,
  //     room: props.room,
  //     removeFrom: removeFromRoom
  //   });
  // };

  return (
    <div className={`game-container ${path}`}>
      <canvas
        className={`game-canvas ${path}`}
        ref={canvasRef}
        style={{
          left: cameraPosition.x,
          bottom: cameraPosition.y,
        }}
      ></canvas>
      <div className="camera"></div>
    </div>
  );
};

export default Canvas;
