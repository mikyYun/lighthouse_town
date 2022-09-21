import Online from "./Online";
import FriendList from "./FriendsList";
import cameraControl from "./helper/cameraControl";
import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import Characters from "./helper/Characters";
import { SocketContext, UserListContext } from "../App";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
const ScreenSizeDetector = require("screen-size-detector");

const Canvas = (props) => {
  const { socket } = useContext(SocketContext);
  const {
    room,
    updateUserState,
    reSendData,
    setReSendData,
    setRoom,
    navigate,
    message,
  } = useContext(UserListContext);
  const [username, setUsername] = useState();
  const canvasRef = useRef(null);
  const location = useLocation();
  const [path, setPath] = useState();
  const [msg, setMsg] = useState({});
  const [userCharacter, setUserCharacter] = useState({});
  const [otherUsersCharacter, setOtherUsersCharacter] = useState({});
  const [cameraPosition, setCameraPosition] = useState({
    x: 0,
    y: 0,
  });
  const { changeRecipient } = props;
  let canvas;

  useEffect(() => {
    const screen = new ScreenSizeDetector();

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

      const navigator = (minX, maxX, minY, maxY, goTo) => {
        if (
          userCharacter[username].state.x >= minX &&
          userCharacter[username].state.x <= maxX &&
          userCharacter[username].state.y >= minY &&
          userCharacter[username].state.y <= maxY
        ) {
          handleRoom(goTo, username);
        }
      };

      // room navigator
      if (path === "plaza") {
        navigator(420, 460, 120, 140, "js");
        navigator(710, 770, 430, 470, "ruby");
        navigator(920, 960, 350, 400, "react");
        navigator(760, 800, 80, 130, "coffee");
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
    };
    overheadMessage();

    return () => clearTimeout(resetMessage);
  }, [message]);

  useMemo(() => {
    /** FIRST RENDERING */
    const cookies = new Cookies();
    const allCookies = cookies.getAll();
    if (!allCookies.userdata) navigate("/")
    if (allCookies.userdata) {
      const currentPath = location.pathname.split("/")[2];
      setPath(currentPath);

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
      }
      if (!userCharacter[userData.userName]) {
        setUserCharacter({
          [userData.userName]: new Characters(userState),
        });
      }
    }
    return () => socket.off();
  }, [navigate]);

  useEffect(() => {
    /** USER AVATAR ONLY */
    canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
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
    const target = message.username;
    if (target === username) {
      userCharacter[username].showChat(ctx, msg[username]);
    }
    if (target !== username && otherUsersCharacter[target]) {
      otherUsersCharacter[target].showChat(ctx, msg[target]);
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

  useEffect(() => {
    setPath(location.pathname.split("/")[2]);
  }, [navigate]);

  useEffect(() => {
    setRoom(path);
  }, [path]);

  function handleRoom(roomTo) {
    if (roomTo === "react" || roomTo === "coffee") {
      navigate("notready");
    } else {
      setOtherUsersCharacter({});
      sendData(roomTo);
      navigate(`game/${roomTo}`);
    }
  }

  function sendData(addToRoom) {
    socket &&
      socket.emit("sendData", {
        userState: userCharacter[username].state,
        room: path,
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
      <div className="side-bar">
        <FriendList changeRecipient={changeRecipient}/>
        <Online changeRecipient={changeRecipient}/>
      </div>
    </div>
  );
};

export default Canvas;
