//client for the socket

// import { createContext } from "react";
import socketIo from "socket.io-client";
// import dayjs from 'react-dayjs';
// export const socket = socketIo(process.env.REACT_APP_BACK_URL);
// export const socket = socketIo(process.env.REACT_APP_BACK_URL); //io()
export const socket = socketIo("http://localhost:8000"); //io()
// export const SocketContext = createContext(socket); //G

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
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE"
  // PRIVATE_MESSAGE: "PRIVATE"
};

//makeMessage
export const makePublicMessage = pongData => {
  const { nickname, content, type, time } = pongData;
  let nicknameLabel;
  let contentLabel = "";
  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${nickname} has joined the room.`;
      break;
    }

    case SOCKET_EVENT.SEND_MESSAGE: {
      contentLabel = String(content);
      nicknameLabel = nickname;
      break;
    }
    // case SOCKET_EVENT.PRIVATE_MESSAGE: {
    //   contentLabel = String(content);
    //   nicknameLabel = nickname;
    //   break;
    // }
    default:
  }

  return {
    nickname: nicknameLabel,
    content: contentLabel,
    // time: dayjs(time).format("HH:mm"),
  };
};

export const makePrivateMessage = pongData => {
  const { recipient, nickname, content, type, time } = pongData;
  // let nicknameLabel;
  let contentLabel = "";

  switch (type) {
    case "PRIVATE": {
      contentLabel = `${nickname} has sent a private message.`;
      console.log(contentLabel)
      contentLabel = String(content);
      // nicknameLabel = nickname;
      // recipientLabel = recipient;
      break;
    }
    // case SOCKET_EVENT.SEND_MESSAGE: {
    //   contentLabel = String(content);
    //   nicknameLabel = nickname;
    //   break;
    // }
    // case SOCKET_EVENT.PRIVATE_MESSAGE: {
    //   contentLabel = String(content);
    //   nicknameLabel = nickname;
    // }
    default:
  }

  return {
    nickname,
    content: contentLabel,
    recipient: recipient.value
    // time: dayjs(time).format("HH:mm"),
  };
};
