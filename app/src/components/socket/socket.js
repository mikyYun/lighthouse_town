import socketIo from "socket.io-client";
export const socket = socketIo("http://localhost:8000"
, {
  transports: ["websocket"]
}
);

export const SOCKET_EVENT = {
  JOIN_ROOM: "JOIN_ROOM",
  UPDATE_NICKNAME: "UPDATE_NICKNAME",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  PRIVATE_MESSAGE: "PRIVATE_MESSAGE"

};

//makeMessage
export const makePublicMessage = pongData => {
  const { nickname, content, type, user } = pongData;
  let contentLabel = "";
  switch (type) {
    case SOCKET_EVENT.JOIN_ROOM: {
      contentLabel = `${nickname} has joined the room.`;
      break;
    }

    case SOCKET_EVENT.SEND_MESSAGE: {
      contentLabel = String(content); //보내는 메세지
      break;
    }

    default:
  }

  return {
    nickname,
    content: contentLabel,
    user
  };
};

export const makePrivateMessage = pongData => {
  const { recipient, nickname, content, type, user } = pongData;
  let contentLabel = "";

  switch (type) {
    case "PRIVATE": {
      contentLabel = String(content);  //보내는 메세지
      break;
    }
    default:
  }

  return {
    nickname, //보내는 사람 이름
    content: contentLabel,  //보내는 메세지
    recipient: recipient.value,  //recipient object의 value {value: moon, label: moon}
    user,
  };
};
