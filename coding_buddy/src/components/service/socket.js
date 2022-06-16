//client for the socket

import { createContext } from "react";
import socketIo from "socket.io-client";
// import dayjs from 'react-dayjs';
// export const socket = socketIo(process.env.REACT_APP_BACK_URL);
// export const socket = socketIo(process.env.REACT_APP_BACK_URL); //io()
export const socket = socketIo(); //io()
export const SocketContext = createContext(socket); //G

// socket.on("connect", () => { //GABRIEL
//   console.log("Service > socket.js: socket server connected.");
//   socket.send('THIS IS TO CONNECT') //browser console.
// });

// socket.on("disconnect", () => {
//   console.log("socket server disconnected.");
// });

export const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  UPDATE_NICKNAME: "UPDATE_NICKNAME",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
};




//makeMessage
export const makeMessage = pongData => {
  const { prevNickname, nickname, content, type, time } = pongData;
  let nicknameLabel;
  let contentLabel = "";
  console.log("inside makeMessage")
  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${nickname} has joined the room.`;
      break;
    }
    case SOCKET_EVENT.UPDATE_NICKNAME: {
      contentLabel = `User's name has been changed.\n ${prevNickname} => ${nickname}.`;
      break;
    }
    case SOCKET_EVENT.SEND_MESSAGE: {
      console.log('socket_event.send_message')
      contentLabel = String(content);
      nicknameLabel = nickname;
      break;
    }
    default:
  }

  return {
    nickname: nicknameLabel,
    content: contentLabel,
    // time: dayjs(time).format("HH:mm"),
  };
};

