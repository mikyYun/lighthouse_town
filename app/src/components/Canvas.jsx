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
  const {
    room,
    userCookie,
    updateUserState,
    onlineLIst,
    reSendData,
    setReSendData,
    roomList,
    setRoom,
    navigate,
    message,
  } = useContext(UserListContext);
  const [username, setUsername] = useState();
  const canvasRef = useRef(null);
  const location = useLocation();
  // const navigate = useNavigate();
  const [path, setPath] = useState();
  // const path = location.pathname.split("/")[2];
  const [msg, setMsg] = useState({});
  const [userCharacter, setUserCharacter] = useState({});
  const [otherUsersCharacter, setOtherUsersCharacter] = useState({});
  const [cameraPosition, setCameraPosition] = useState({
    x: 0,
    y: 0,
  });
  // const [ctx, setCtx] = useState()
  // const [targetUser, setTargetUser] = useState();

  const [sizeCheck, setSizeCheck] = useState();
  // const screen = new ScreenSizeDetector();
  let canvas;

  useEffect(() => {
    const screen = new ScreenSizeDetector();
    // console.log("LOCATION", location, "NAVIGATE", navigate)

    const keyDown = (e) => {
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

      /** NAVIGATE ROOMS */

      // move to JS
      if (path === "plaza") {
        if (
          userCharacter[username].state.x >= 420 &&
          userCharacter[username].state.x <= 460 &&
          userCharacter[username].state.y >= 120 &&
          userCharacter[username].state.y <= 140
        ) {
          // sendData(room);
          // setUserCharacter({ ...userCharacter, [username]: undefined });
          // console.log(location.pathname)
          // location.pathname="game/js"
          // navigate("game/js")
          // setPath("js")
          // history.push("js")
          handleRoom("js", username);
        }

        // move to Ruby
        if (
          userCharacter[username].state.x >= 710 &&
          userCharacter[username].state.x <= 770 &&
          userCharacter[username].state.y >= 430 &&
          userCharacter[username].state.y <= 470
        ) {
          handleRoom("ruby", username);
        }
      }
      // move to the Plaza
      if (path !== "plaza") {
        if (
          userCharacter[username].state.x <= 50 &&
          userCharacter[username].state.y >= 410 &&
          userCharacter[username].state.y <= 450
        ) {
          handleRoom("plaza", username);
        }
      }
    };

    document.addEventListener("keydown", keyDown);

    const keyUp = (e) => {
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
    };

    document.addEventListener("keyup", keyUp);

    /** MAKE MAP RESPONSIVE */

    // const initialMapHeight = (screenHeight) => {
    //   if (screenHeight < 640) {
    //     return 640 - screenHeight;
    //   }
    // };

    // setCameraPosition((prev) => ({
    //   ...prev,
    //   y: initialMapHeight(screen.height),
    //   // y : -150,
    // }));
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
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp);
    };
  }, [path]);

  useEffect(() => {
    const resetMessage = setTimeout(() => {
        setMsg((prev) => ({
          ...prev,
          [message.sender]: "",
        }));
      }, 3000);

    const overheadMessage = () => {
      setMsg((prev) => ({
        ...prev,
        [message.sender]: message.content,
      }));
    }
    overheadMessage()

    return () => clearTimeout(resetMessage)
  }, [message]);

  useMemo(() => {
    /** FIRST RENDERING */
    const cookies = new Cookies();
    const allCookies = cookies.getAll();
    if (!allCookies.userdata) {
      // console.log(allCookies.userdata)
      alert("INVALID ACCESS");
      // return <Redirect to="/" />
      navigate("/");
    } else if (allCookies.userdata) {
      const currentPath = location.pathname.split("/")[2];
      setPath(currentPath);
      console.log(currentPath);
      // setRoom(location.pathname.split("/")[2])

      /** IF A USER DATA STORED IN Cookie
       * open socket to update onlineUserObj
       * AND SEND THE NEW USER's POSITIO TO ALL USERS
       */
      const userData = allCookies.userdata;
      const avatar = userData.avatar;

      const updateUserSocketId = (usernameInCookie) => {
        setUsername(usernameInCookie);

        socket &&
          socket.emit("UPDATE SOCKETID", {
            username: usernameInCookie,
            avatar,
            currentRoom: currentPath,
          });
      };

      updateUserSocketId(userData.userName);

      const startingPosition = { x: 200, y: 420 };

      const userState = {
        username: userData.userName,
        x: startingPosition.x,
        y: startingPosition.y,
        currentDirection: 0,
        frameCount: 0,
        avatar,
      };
      if (userCharacter[userData.userName]) {
        userCharacter[username].reset();
        setCameraPosition({
          x: 0,
          y: 0,
        });
        //   [userCharacter[userData.userName]] = userCharacter[userData.userName].reset();
      }
      if (!userCharacter[userData.userName]) {
        setUserCharacter({
          [userData.userName]: new Characters(userState),
        });
      }
      console.log("RENDERING", userCharacter);
    }
    return () => socket.off();
  }, [navigate]);

  useEffect(() => {
    /** USER AVATAR ONLY */
    canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    // setCtx(canvas.getContext("2d"))
    const ctx = canvas.getContext("2d");
    userCharacter[username].drawFrame(ctx);
    userCharacter[username].showName(ctx);

    /** OTHER ONLINE USERS */
    Object.keys(otherUsersCharacter).forEach((user) => {
      if (user !== undefined && user !== username) {
        otherUsersCharacter[user].drawFrame(ctx);
        otherUsersCharacter[user].showName(ctx);
      }
    });
    const target = message.username
    if (target === username) {
      // console.log("MY MESSGE", username)
        userCharacter[username].showChat(ctx, msg[username]);
        // setTimeout(() => {
        // userCharacter[username].showChat(ctx, "");
        // }, 2000)
    }
    if (target !== username && otherUsersCharacter[target]) {
      otherUsersCharacter[target].showChat(ctx, msg[target]);
      // setTimeout(() => {
      //   otherUsersCharacter[target].showChat(ctx, "");
      //   }, 2000)
      // console.log("YOUR MESSGE", username, msg)

    }
  }, [username, userCharacter, otherUsersCharacter, msg]);

  useEffect(() => {
    if (
      username !== updateUserState.username &&
      updateUserState.username !== undefined
    ) {
      if (updateUserState.remove) {
        delete otherUsersCharacter[updateUserState.username];
        setOtherUsersCharacter((prev) => ({
          ...prev,
        }));
      } else {
        const targetUsername =
          updateUserState.username && updateUserState.username;
        if (otherUsersCharacter[targetUsername]) {
          otherUsersCharacter[targetUsername].state = updateUserState;
          setOtherUsersCharacter((prev) => ({
            ...prev,
          }));
        }
        if (!otherUsersCharacter[targetUsername]) {
          setOtherUsersCharacter((prev) => ({
            ...prev,
            [targetUsername]: new Characters(updateUserState),
          }));
        }
      }
    }
    // if (reSendData) {
    //   // sendData();

    //   socket &&
    //     socket.emit("resendData", {
    //       userState: userCharacter[username].state,
    //       room,
    //   //     removeFrom: removeFromRoom,
    //     });
    //   setReSendData(false)
    // }
    // sendData();
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
    //   });
    // return () => sendData();
  }, [updateUserState]);

  useEffect(() => {
    if (reSendData) {
      setReSendData(false);
      socket &&
        socket.emit("resendData", {
          userState: userCharacter[username].state,
          room,
        });
    }
  }, [reSendData]);

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

  useEffect(() => {
    setPath(location.pathname.split("/")[2]);
  }, [navigate]);

  useEffect(() => {
    setRoom(path);
  }, [path]);

  function handleRoom(roomTo) {
    setOtherUsersCharacter({});
    sendData(path, roomTo);
    navigate(`game/${roomTo}`);
    /** CLEAR OTHER USERS */
    // setUserCharacter({ ...userCharacter, [userName]: undefined });
    // setPath(roomTo);
    // console.log("ROOMTO", path)
    // setRoom(roomTo)
    // navigate(`${roomTo}`)
    // userDataInCookies
    // navigate(roomLists[room], { state: [props.username, props.avatar] });
    // const cookies = new Cookies();
    // const userDataInCookies = cookies.getAll().userdata;
    // const userLanguages = userDataInCookies.userLanguages;
    // const userID = userDataInCookies.id;
    // const avatar = userDataInCookies.avatar;
    // navigate(roomLists[roomTo], {
    // state: [username, avatar, userLanguages, userID],
    // });
    // navigate(0, { state: [username, avatar, userLanguages, userID] });
  }

  function sendData(removeFromRoom, addToRoom) {
    // console.log("canvasUserCookie",userCookie)
    // console.log(userCharacters[userCookie.userName])
    // const cookie = new Cookies().getAll().userdata;
    // const username = cookie.userName;
    socket &&
      socket.emit("sendData", {
        userState: userCharacter[username].state,
        room: path,
        // removeFrom: removeFromRoom,
        addTo: addToRoom,
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
