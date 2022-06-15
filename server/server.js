// server running with nodemon : npm run dev
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const express = require('express');
const session = require('express-session');
const app = express();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io"); //socketIo
const io = new Server(httpServer
  , {
    cors: {
      origin: "http://localhost:3000", //client
      credentials: true,
    },
  }
);
const socket = require("./socket/index.js");
const { createAdapter } = require('@socket.io/postgres-adapter'); //app.get, 안써도 socket.io 안에서 직접 postgres 연결이 가능. root path 따로 설정 불필요.
const sessionMiddleware = session({ secret: 'coding_buddy', cookie: { maxAge: 60000 } });
const { Pool } = require('pg');

// const db = require("./coding_buddy_db");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

socket(io);// /src/socket/index.js 의 socket으로 socketIo 객체를 전달

//G. socket(server)
//G. create a new instance of a socket handler
//G. and passing io as an argument.
//G. io is the Server.

app.use(cors()); // cors 미들웨어 사용
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.adapter(createAdapter(pool));
// store all users' socket id with username key-value pair
let currentUsers = {}; // => {username : socket.id}
// socket.id : username
io.on("connection", (socket) => {
  const session = socket.request.session;
  session.save();
  // const req = socket.request;
  // const userName = {};

  console.log('a user connected: ', socket.id);

  socket.emit("init", { data: 'hello world' });
  socket.on('sendData', data => {
    console.log(data);
    // add userid from data
    const users = [];
    users.push(data);
    socket.broadcast.emit('backData', users);
  });

  // socketID and username matching
  // socket.on("SET USERNAME", (socketID, username) => {
  socket.on("SET USERNAME", (obj) => {
    console.log("SETSETSET", obj);
    const username = obj.username;
    const socketid = obj.socketID;
    console.log(socketid);
    console.log(username);
    // currentUsers[id] = username;
    // const id = socketID
    // currentUsers = {...currentUsers, socketid : username}
    // currentUsers[socketid] = username;
    currentUsers[username] = socketid
    console.log("AFTER LOGIN, SET USER NAME AND SOCKET ID PAIR", currentUsers);
  });

  //////////////////////////// currentUsers 오브젝트에서 종료되는 유저 삭제
  socket.on("disconnect", () => {
    // console.log("disconnected id", socket.id)
    console.log("CURRENT USERS", currentUsers);
    Object.keys(currentUsers).forEach((username) => {
      if (currentUsers[username] === socket.id) {
        delete currentUsers[socket.id]
        console.log("DELETE DISCONNECT USER DATA FROM currentusers OBJ", currentUsers);
      }
    })
    // delete currentUsers[socket.id];

  });

  // socket.on("LOGIN", (data) => {
  //   // userData = {"userEmail" : ~~, "userPassword" : ~~}
  //   console.log("LOGIN", data);
  //   socket.emit("SUCCESS", data.userData.userEmail); //  클라이언트에 유저 이메일만 전송
  //   socket.request.session.reload((err) => {
  //     if (err) {
  //       return console.log("ERROR");
  //     }
  //     console.log("clicked", socket.request.session);
  //     // userName["userEmail"] = userData.userEmail;
  //   });
  // });

  // receive message
  socket.on("NEW MESSAGE", (e) => {
    console.log(e);
    // all users
    io.emit("PASS", "PASS");
    // to specific user
    // socket.broadcast.emit("PASS", "to all users") // works
  });

  socket.on("PRIVATE MESSAGE", (obj) => {
    // e = {target: username, message: "message"}
    // const Name target
    const msg = obj.message;
    const targetName = obj.target;
    // const senderId = obj.senderID;
    const username = obj.username
    console.log(targetName);
    console.log(currentUsers);
    // let targetSocketId;

    const targetSocketId = currentUsers[targetName] // get target's socketid

    // const senderName = currentUsers[senderId];
    // Object.keys(currentUsers).forEach(recipientSocketId => {
    //   if (currentUsers[recipientSocketId] === targetName) {
    //     targetSocketId = recipientSocketId;
    //     console.log(targetSocketId);
    //   }
    //   // if (currentUsers.socket.id)
    // });
    socket.to(targetSocketId).emit("PRIVATE MESSAGE", { "message": msg, from: username });
  });

});


// 서버에서 app.get 으로 가는건 서버의 루트(local..) / .... 으로 감
app.get("/", (req, res) => { // server url -> 8000
  res.json({ test: "start" });
});

// 로그인 정보 리퀘스트 .. 진행중
app.post("/login", (req, res) => {
  // client sending
  console.log("login request", req.body);
  // req.body = {userEmail: '', userPassword: ''}

  const email = req.body.userEmail;
  const password = req.body.userPassword;
  // and password.. userName=$1 AND userpassword=$2
  return pool.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password], (err, res_1) => {
    if (err) throw err;
    console.log(res_1.rows);
    if (res_1.rows[0]) { // user exist
      const userInfo = res_1.rows[0];
      const userName = userInfo.username;
      const avatar = userInfo.avatar_id;
      console.log(res_1.rows[0]); // id: 3, username: "mike", password: "mike", email: "test2@test.com", avatar_id: 1
      const userID = res_1.rows[0].id;
      // find languages
      pool.query("SELECT * FROM user_language WHERE user_id=$1", [userID], (err, res_2) => {
        const userLanguages = [];
        if (err) throw err;
        if (res_2.rows.length > 0) {
          console.log("find user's languages", res_2.rows);
          res_2.rows.forEach(obj => {
            userLanguages.push(obj.language_id);
          });
          const loginUserData = {
            userName, avatar, userLanguages
          };
          res.status(201).send(loginUserData);
        } else {
          console.log("No available language", res_2.rows);
        }
      });
    } else { // no matching user
      res.status(201).send(false);
    }
  });
});
//"/login" => local 8000/login
app.post("/register", (req, res) => {
  console.log("post register request", req.body);
  // req.body = userInfo = {
  //   userName,
  //   userPassword,
  //   userEmail,
  //   userLanguages,
  //   userAvatar,
  // };
  const userName = req.body.userInfo.userName;
  const userPassword = req.body.userInfo.userPassword;
  const userEmail = req.body.userInfo.userEmail;
  const userLanguages = req.body.userInfo.userLanguages;
  const userAvatar = req.body.userInfo.userAvatar;
  pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [userName, userEmail], (err, res_1) => {
    if (err) throw err;
    console.log(res_1.rows[0]);
    if (res_1.rows[0]) return res.status(201).send("existing data");
  });
  pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [userName, userPassword, userEmail, userAvatar], (err, result) => {
    if (err) throw err;
    console.log("new user registered");
    pool.query("SELECT id FROM users WHERE username = $1", [userName], (err, res_2) => {
      console.log("new user's user ID", res_2.rows);
      const newUserID = res_2.rows[0].id;
      userLanguages.forEach(lang_id => {
        if (lang_id) {
          console.log(lang_id);
          pool.query("INSERT INTO user_language (user_id, language_id) VALUES ($1, $2) RETURNING *", [newUserID, lang_id], (err, res_3) => {
            if (err) throw err;
            console.log("new user's language data added", res_3.rows);
          });
        }
      });
    });
  });
  res.status(201).send({ userName, userEmail, userLanguages, userAvatar });
});

httpServer.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`);
  // console.log(`Server Started on port ${PORT}in ${ENV} mode`);
});