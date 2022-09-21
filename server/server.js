const poolGroup = require("./coding_buddy_db");
const { pool, tryLogin, registerUser, getUserInfo, addFriend, removeFriend } = poolGroup;

/** USE .env */
require("dotenv").config();

/** REQUIRES */
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const app = express();
const httpServer = require("http").createServer(app);
const { createAdapter } = require("@socket.io/postgres-adapter");

/** INTEGRATING Socket.io */
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL,
    Credential: true,
  }
});

const sessionMiddleware = session({
  secret: "coding_buddy",
  cookie: { maxAge: 60000 },
});

/** SET EXPRESS TO USE PACKAGES */
app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
/** ADAPTER TO USE QUERIES */
io.adapter(createAdapter(pool));

// store all users' socket id with username key-value pair
const currentUsers = {}; // => {username : socket.id}
const usersInRooms = {};



// OPEN SOCKET
io.on("connection", (socket) => {
  const session = socket.request.session;
  /** CONNECTED SOCKET SAVE IN SESSION */
  session.save();
  console.log("CONNECTED")
  /** RECONNECTED USER (PAGE REFRESH) */
  socket.on("UPDATE SOCKETID", ({ username, avatar, currentRoom }) => {
    currentUsers[username] = socket.id;
    socket.join(currentRoom);
    const userNames = Object.keys(currentUsers);
    const updatedUserName = username;
    /** SEND TO ALL USERS IN currentRoom BUT NOT SENDER
     * ONLY IF ONLINEUSERS ARE MORE THAN ONE
     */
    if (userNames.length > 1) {
      socket.to(currentRoom).emit(currentRoom, { userNames, updatedUserName, avatar, reSend: true });
    }
  });

  socket.on("SET USERNAME", ({ socketID, username, currentRoom }) => {
    currentUsers[username] = socketID;

    /** LOGIN OR REGISTERED USER JOIN ROOM PLAZA */
    socket.join(currentRoom);
    const userNames = Object.keys(currentUsers);
    io.emit(currentRoom, { userNames });
  });



  socket.on("resendData", data => {
    const { userState, room } = data;
    if (userState.username !== undefined) {
      socket.to(room).emit("CURRENT USERS STATE", userState);
    }
  });

  // FOR USER MOVEMENT (Canvas)
  socket.on('sendData', data => {
    const { userState, room, addTo } = data;
    console.log("MOVE")
    if (addTo) {
      /** LOGOUT */
      if (addTo === "logout") {
        let removedName = userState.username;
        delete currentUsers[userState.username];
        const alluserNames = Object.keys(currentUsers);

        socket.to(room).emit("REMOVE LOGOUT USER", {
          updatedUserNames: alluserNames,
          removedName
        });
        /** CHANGE ROOM */
      } else {
        socket.join(addTo);
        socket.to(addTo).emit("sendData", userState);
        socket.leave(room);
        userState["remove"] = true;
  
        socket.to(room).emit("sendData", userState);
      }
      /** MOVE */
    } else {
      socket.to(room).emit("sendData", userState);
    }
  });

  socket.on("lecture", url => {
    // // console.log(url)
    // const address = 'https://www.youtube.com/embed/' + url.split('=')[1];
    // io.emit("new lecture", address);
  });

  socket.on("SEND_MESSAGE", (msg) => {
    console.log("MSG", msg)
    // msg = {nickname, content: "", recipient: recipient}
    // nickname = 보내는사람
    // content = 내용
    // recipient = 받는사람
    // const Name target
    const monthNames = {
      01: "January",
      02: "February",
      03: "March",
      04: "April",
      05: "May",
      06: "June",
      07: "July",
      08: "August",
      09: "September",
      10: "October",
      11: "November",
      12: "December"
    };
    const TIME = new Date();
    const MONTH = monthNames[TIME.getMonth()].slice(0, 3);
    const DAY = TIME.getDate();
    const HOUR = TIME.getHours();
    const MINUITE = TIME.getMinutes();
    const timeFormat = `${MONTH}/${DAY} ${HOUR}:${MINUITE}`;

    if (msg.isPrivate) {
      const sendMessage = {
        ...msg,
        type: "PRIVATE",
        time: timeFormat
      };

      const recipient = msg.recipient;
      const senderSocketID = currentUsers[msg.sender];
      const recipientSocketId = currentUsers[recipient];
      io
        .to(recipientSocketId)
        .emit("RECEIVE_MESSAGE", sendMessage);
      io
        .to(senderSocketID)
        .emit("RECEIVE_MESSAGE", sendMessage);
    } else if (!msg.isPrivate) {
      const sendMessage = {
        ...msg,
        type: "PUBLIC",
        time: timeFormat
      };
      io.to(msg.room).emit("RECEIVE_MESSAGE", sendMessage);
    }
  });

  /* ADDED FROM socket/index.js */
  const usersWithRoom = {};
  const rooms = ['plaza', 'js', 'ruby'];
  let newRoom;

  // socket.on("JOIN_ROOM", (requestData) => {
  //   // 콜백함수의 파라미터는 클라이언트에서 보내주는 데이터.
  //   // 이 데이터를 소켓 서버에 던져줌.
  //   // 소켓서버는 데이터를 받아 콜백함수를 실행.
  //   // const currentRoom = usersWithRoom[requestData[0]];

  //   newRoom = requestData[1];
  //   socket.join(newRoom); // user를 "room 1" 방에 참가시킴.
  //   const responseData = {
  //     ...requestData,
  //     type: "JOIN_ROOM",
  //     time: new Date(),
  //   };
  //   // console.log('JOIN TO NEW ROOM', newRoom)

  //   // receive.message는 ChatRoom.jsx 에서 defined
  //   // --------------- SEND MESSAGE ---------------
  //   socket.on("SEND_MESSAGE", (requestData) => {
  //     console.log(requestData)
  //     //emiting back to receive message in line 67
  //     // console.log('REQUEST', requestData);
  //     const responseData = {
  //       ...requestData,
  //       type: "SEND_MESSAGE",
  //       time: new Date(),
  //     };
  //     // console.log("SEND TO NEWROOM", responseData)
  //     // SVGPreserveAspectRatio.to(roomName).emit
  //     // io.to(newRoom).emit("RECEIVE_MESSAGE", responseData);

  //     //responseData = chat message
  //     //@@@@@@ ChatRoom.jsx line 21
  //     // console.log(
  //     //   `"SEND_MESSAGE" is fired with data: ${JSON.stringify(responseData)}`
  //     // );
  //     // io.emit("dataToCanvas", responseData);
  //   });


  //   // "room 1"에는 이벤트타입과 서버에서 받은 시각을 덧붙여 데이터를 그대로 전송.
  //   io.to(newRoom).emit("RECEIVE_MESSAGE", responseData);
  //   // 클라이언트에 이벤트를 전달.
  //   // 클라이언트에서는 RECEIVE_MESSAGE 이벤트 리스너를 가지고 있어서 그쪽 콜백 함수가 또 실행됌. 서버구현 마치고 클라이언트 구현은 나중에.
  //   console.log(
  //     `JOIN_ROOM is fired with data: ${JSON.stringify(responseData)}`
  //   );
  //   // io.to(roomName).emit("all user names", "jasklefjl;ksajv@@@@@")
  // });

  socket.on("UPDATE_NICKNAME", (requestData) => {
    const responseData = {
      ...requestData,
      type: "UPDATE_NICKNAME",
      time: new Date(),
    };
    // io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
    console.log(
      `UPDATE_NICKNAME is fired with data: ${JSON.stringify(responseData)}`
    );
  });




  /* 오브젝트에서 종료되는 유저 삭제 */
  socket.on("disconnect", (msg) => {
    // msg = transport close
    console.log("DISCONNECTED")
    const alluserNames = Object.keys(currentUsers);
    let removedName;
    alluserNames.forEach((name) => {
      if (currentUsers[name] === socket.id)
        delete currentUsers[name];
      removedName = name;
    });
    const updatedUserNames = Object.keys(currentUsers);
    io.emit("REMOVE LOGOUT USER", { updatedUserNames, removedName });
  });
});

app.get("/", (req, res) => {
  res.json({ connected: "start" });
});

app.post("/login", (req, res) => {
  return tryLogin(req, res);
});

app.post("/register", (req, res) => {
  return registerUser(req, res);
});

app.post("/user", (req, res) => {
  // console.log("REQ.BODY", req.body)
  return getUserInfo(req, res);
  // return getUserInfo(req.body.username)
});

app.post("/user/add", (req, res) => {
  // console.log("ADDFRIEND",req.body)
  return addFriend(req, res);
});

app.post("/user/remove", (req, res) => {
  return removeFriend(req, res);
});

app.post("/logout", (req, res) => {

});

httpServer.listen(PORT, () => {
  console.log(
    `SERVER.JS || Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`
  );
});