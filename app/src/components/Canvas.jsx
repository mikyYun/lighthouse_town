import axios from "axios";
import Online from "./Online";
import FriendList from "./FriendsList";
import cameraControl from "./helper/cameraControl";
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import Characters from "./helper/Characters";
import { SocketContext, UserListContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
const ScreenSizeDetector = require("screen-size-detector");

const Canvas = () => {
  const { socket } = useContext(SocketContext);
  const { room, userCookie, updateUserState, onlineLIst } = useContext(UserListContext);
  const [username, setUsername] = useState();
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[2];
  const [msg, setMsg] = useState({});
  const [userCharacter, setUserCharacter] = useState({});
  const [otherUsersCharacter, setOtherUsersCharacter] = useState({});
  const [cameraPosition, setCameraPosition] = useState({
    x: 0,
    y: 0,
  });
  const [targetUser, setTargetUser] = useState();

  const [sizeCheck, setSizeCheck] = useState();
  // const screen = new ScreenSizeDetector();
  let canvas;

  useEffect(() => {
    const screen = new ScreenSizeDetector();

    document.addEventListener("keydown", (e) => {
      const keyCode = e.keyCode;
      if (
        keyCode === 37 ||
        keyCode === 38 ||
        keyCode === 39 ||
        keyCode === 40
      ) {
        userCharacter[username]?.move(keyCode);
        cameraControl(
          keyCode,
          setCameraPosition,
          screen,
          userCharacter,
          username
        );

        setUserCharacter((prev) => ({
          ...prev,
          [username]: prev[username],
        }));
        sendData();
      }
      // canvas = canvasRef.current;
      // const ctx = canvas.getContext("2d");
      // userCharacters[username].drawFrame(ctx);
      // userCharacters[username].showName(ctx);
      // userCharacters[username].drawFrame(ctx);
      // userCharacters[username].showName(ctx);
    });

    document.addEventListener("keyup", (e) => {
      const keyCode = e.keyCode;
      if (
        keyCode === 37 ||
        keyCode === 38 ||
        keyCode === 39 ||
        keyCode === 40
      ) {
        userCharacter[username]?.stop(keyCode);
        setUserCharacter((prev) => ({
          ...prev,
          [username]: prev[username],
        }));
        sendData();
      }
    });

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
    /** make map responsive */
    // const getWindowDimentions = () => {
    //   const { innerWidth: innerWidth, innerHeight: innerHeight } = window;

    //   // setCameraPosition(prev => ({
    //   //   ...prev,
    //   //   x: 0
    //   // }))
    //   return { innerWidth, innerHeight };
    // };
    // const handleResize = () => {
    //   setSizeCheck(getWindowDimentions());
    // };

    // window.addEventListener("resize", handleResize);

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
    return () => {
      document.removeEventListener("keydown");
      document.removeEventListener("keyup");
    };
  }, []);

  // useEffect(() => {
  //   console.log("ONLINELINST", onlineLIst)
  // }, [onlineLIst])

  useMemo(() => {
    /** FIRST RENDERING */
    console.log("CANVAS RENDERED", onlineLIst)
    const cookies = new Cookies();
    const allCookies = cookies.getAll();
    if (!allCookies.userData) {
      navigate("/");
    }
    const userData = allCookies.userdata;

    const updateUserSocketId = (username) => {
      if (username) {
        console.log(username, room, "EXIST");
        setUsername(username);
        
        socket &&
          socket.emit("UPDATE SOCKETID", {
            username,
            currentRoom: room,
          });
      }
    };

    updateUserSocketId(userData.userName);
    const avatar = userData.avatar;
    const startingPosition = { x: 200, y: 420 };

    setUserCharacter({
      [userData.userName]: new Characters({
        username: userData.userName,
        x: startingPosition.x,
        y: startingPosition.y,
        currentDirection: 0,
        frameCount: 0,
        avatar,
      }),
    });
    return () => socket.off();
  }, []);

  useEffect(() => {
    /** USER AVATAR ONLY */
    canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    userCharacter[username].drawFrame(ctx);
    userCharacter[username].showName(ctx);
    // sendData();

    /** OTHER ONLINE USERS */
    console.log("TARGETUSER", targetUser)
    if (targetUser) {
      otherUsersCharacter[targetUser].drawFrame(ctx);
      otherUsersCharacter[targetUser].showName(ctx);
    }


  }, [userCharacter, otherUsersCharacter, targetUser]);

  useEffect(() => {
    console.log("updateUserState", updateUserState)
    // console.log("room", room);
    // socket &&
    // socket.on(`sendData`, (userState) => {
        const username = updateUserState.username && updateUserState.username;
        setTargetUser(username);
        setOtherUsersCharacter((prev) => ({
          ...prev,
          [username]: new Characters(updateUserState),
        }));
        // console.log(otherUsersCharacter[username]);
        // canvas = canvasRef.current;
        // canvas.width = 1120;
        // canvas.height = 640;
        // const ctx = canvas.getContext("2d");
        // otherUsersCharacter[username].drawFrame(ctx);
        // otherUsersCharacter[username].showName(ctx);
        // otherUsersCharacter[userState.username] ? (
        //   setOtherUsersCharacter(prev => ({
        //     ...prev,
        //     [userState.username] : userState
        //   }))
        // ) : (
        //   setOtherUsersCharacter(prev => ({

        //   }))
        // )
        // setUserCharacter({
        //   [userData.userName]: new Characters({
        //     username: userData.userName,
        //     x: startingPosition.x,
        //     y: startingPosition.y,
        //     currentDirection: 0,
        //     frameCount: 0,
        //     avatar,
        //   }),
        // });
      // });
    // return () => socket.off();
  }, [updateUserState]);

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

  // useEffect(() => {
  //   const initialMapHeight = (screenHeight) => {
  //     if (screenHeight < 640) {
  //       return 640 - screenHeight;
  //     }
  //   };

  //   setCameraPosition((prev) => ({
  //     ...prev,
  //     y: initialMapHeight(screen.height),
  //     // y : -150,
  //   }));
  // }, []);

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

  function sendData(removeFromRoom) {
    // console.log("canvasUserCookie",userCookie)
    // console.log(userCharacters[userCookie.userName])
    const cookie = new Cookies().getAll().userdata;
    const username = cookie.userName;
    socket &&
      socket.emit("sendData", {
        userState: userCharacter[username].state,
        room,
        removeFrom: removeFromRoom,
      });
  }

  return (
    <div
      className={`game-container ${path}`}
      // style={{
      //   left: cameraPosition.x,
      //   bottom: cameraPosition.y,
      // }}
    >
      <canvas
        className={`game-canvas ${path}`}
        ref={canvasRef}
        style={{
          left: cameraPosition.x,
          bottom: cameraPosition.y,
        }}
      ></canvas>
      {/* <div className="camera"></div> */}
      <div className="side-bar">
        <FriendList />
        <Online />
      </div>
    </div>
  );
};

export default Canvas;
