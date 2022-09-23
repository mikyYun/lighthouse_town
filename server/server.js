const poolGroup = require("./coding_buddy_db");
const { pool, tryLogin, registerUser, getUserInfo, addFriend, removeFriend } = poolGroup;

/** USE .env */
require("dotenv").config();

/** REQUIRES */
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
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



// OPEN SOCKET
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED!!!")
  // LOGIN USER CONNECTED
  const session = socket.request.session;
  /** CONNECTED SOCKET SAVE IN SESSION */
  session.save();
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
    if (addTo) {
      /** LOGOUT */
      if (addTo === "logout") {
        let removedName = userState.username;
        delete currentUsers[userState.username];
        const alluserNames = Object.keys(currentUsers);
        userState["remove"] = true
        
        socket.to(room).emit("REMOVE LOGOUT USER", userState)
        // socket.to(room).emit("REMOVE LOGOUT USER", {
        //   updatedUserNames: alluserNames,
        //   removedName
        // });
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

  /** NOT IMPLEMENTED YET */
  // socket.on("lecture", url => {
    // console.log(url)
    // const address = 'https://www.youtube.com/embed/' + url.split('=')[1];
    // io.emit("new lecture", address);
  // });

  socket.on("SEND_MESSAGE", (msg) => {
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

  /** NOT IMPLEMENTED YET */
  /* ADDED FROM socket/index.js */
  socket.on("UPDATE_NICKNAME", (requestData) => {
    const responseData = {
      ...requestData,
      type: "UPDATE_NICKNAME",
      time: new Date(),
    };
    // io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
  });

  /* 오브젝트에서 종료되는 유저 삭제 */
  socket.on("disconnect", (msg) => {
    // msg = transport close
    const alluserNames = Object.keys(currentUsers);
    let removedName;
    alluserNames.forEach((name) => {
      if (currentUsers[name] === socket.id)
        delete currentUsers[name];
      removedName = name;
    });
    const userState = {
      username: removedName,
      remove: true
    }
    const updatedUserNames = Object.keys(currentUsers);
    io.emit("REMOVE LOGOUT USER", userState);
    // io.emit("REMOVE LOGOUT USER", { updatedUserNames, removedName });
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
  return getUserInfo(req, res);
});

app.post("/user/add", (req, res) => {
  return addFriend(req, res);
});

app.post("/user/remove", (req, res) => {
  return removeFriend(req, res);
});

app.post("/logout", (req, res) => {

});

app.post("/connection", (req, res) => {
  console.log("CONNECTION REQUEST")
  pool.query(`
    SELECT * FROM users
  `)
  .then((result) => {
    console.log("RESULT", result.rows)
    res.status(200).send(result.rows)
  })
  .catch(err => {
    res.status(409).send(err)
  })
})
app.get("/connection", (req, res) => {
  res.status(200).send({TEST:"TEST. SERVER LIVE"})
})

httpServer.listen(PORT, () => {
  console.log(
    `SERVER.JS || Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`
  );
});