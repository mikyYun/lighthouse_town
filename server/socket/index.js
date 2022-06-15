module.exports = function (socketIo) {

  // ===============  EVENT TYPES  =============== //

  const SOCKET_EVENT = {
    JOIN_ROOM: "JOIN_ROOM",
    UPDATE_NICKNAME: "UPDATE_NICKNAME",
    SEND_MESSAGE: "SEND_MESSAGE",
    RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  };

  // ===============  CONNECT  =============== //

  // client side event listener
  socketIo.on("connection", function (client) {
    // 클라이언트와 연결이 되면 연결된 사실을 출력합니다.
    console.log('socket.on', client.on)
    console.log("socket connection succeeded."); //in terminal - vs code

    // 구현 편의상, 모든 클라이언트의 방 번호는 모두 "room 1"으로 배정해줍니다.
    const roomName = "room 1";

    /*
    "JOIN_ROOM": 유저가 방에 참가했을 때 발생
    "UPDATE_NICKNAME": 유저가 닉네임을 변경했을 때 발생
    "SEND_MESSAGE": 유저가 메시지를 전송했을 때 발생
    "RECEIVE_MESSAGE": 유저가 메시지를 받을 때 발생
    */



    // ===============  EVENTS  =============== //

    // --------------- JOIN ROOM ------------

    // server side event listener

    client.on(SOCKET_EVENT.JOIN_ROOM, requestData => {
      // 콜백함수의 파라미터는 클라이언트에서 보내주는 데이터. 
      // 이 데이터를 소켓 서버에 던져줌.
      // 소켓서버는 데이터를 받아 콜백함수를 실행.
      client.join(roomName); // user를 "room 1" 방에 참가시킴.
      const responseData = {
        ...requestData,
        type: SOCKET_EVENT.JOIN_ROOM,
        time: new Date(),
      };
      // "room 1"에는 이벤트타입과 서버에서 받은 시각을 덧붙여 데이터를 그대로 전송.
      socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
      // 클라이언트에 이벤트를 전달.
      // 클라이언트에서는 RECEIVE_MESSAGE 이벤트 리스너를 가지고 있어서 그쪽 콜백 함수가 또 실행됌. 서버구현 마치고 클라이언트 구현은 나중에.
      console.log(`JOIN_ROOM is fired with data: ${JSON.stringify(responseData)}`);
    });

    // --------------- UPDATE NICKNAME ---------------
    client.on(SOCKET_EVENT.UPDATE_NICKNAME, requestData => {
      const responseData = {
        ...requestData,
        type: SOCKET_EVENT.UPDATE_NICKNAME,
        time: new Date(),
      };
      socketIo.to(roomName).emit("RECEIVE_MESSAGE", responseData);
      console.log(`UPDATE_NICKNAME is fired with data: ${JSON.stringify(responseData)}`);
    });

    // receive.message는 ChatRoom.jsx 에서 defined 
    // --------------- SEND MESSAGE ---------------
    client.on(SOCKET_EVENT.SEND_MESSAGE, requestData => {
      console.log('I got a message')
      //emiting back to receive message in line 67
      const responseData = {
        ...requestData,
        type: SOCKET_EVENT.SEND_MESSAGE,
        time: new Date(),
      };
      // SVGPreserveAspectRatio.to(roomName).emit
      socketIo.emit(SOCKET_EVENT.RECEIVE_MESSAGE, responseData);
      //responseData = chat message
      //@@@@@@ ChatRoom.jsx line 21
      console.log(`${SOCKET_EVENT.SEND_MESSAGE} is fired with data: ${JSON.stringify(responseData)}`);
    });

    // ===============  DISCONNECT  =============== //
    client.on("disconnect", reason => {
      console.log(`disconnect: ${reason}`);
    })
  })
}