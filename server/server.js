// server running with nodemon : npm run dev
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const express = require("express");
const session = require("express-session");
const app = express();
const httpServer = require("http").createServer(app);
const { Server } = require("socket.io"); //socketIo
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", //client
    credentials: true,
  },
});

const { createAdapter } = require("@socket.io/postgres-adapter"); //app.get, 안써도 socket.io 안에서 직접 postgres 연결이 가능. root path 따로 설정 불필요.
const sessionMiddleware = session({
  secret: "coding_buddy",
  cookie: { maxAge: 60000 },
});
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

//G. socket(server)
//G. create a new instance of a socket handler
//G. and passing io as an argument.
//G. io is the Server.

app.use(cors());
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

const users = {};
// store all users' socket id with username key-value pair
let currentUsers = {}; // => {username : socket.id}

io.on("connection", (socket) => {
  const roomName = "room 1";
  const session = socket.request.session;
  session.save();

  // use object
  // socket.emit("init", {data: 'hello world'})
  socket.on('sendData', data => {
    console.log('sendData', data); // print on server
    // add userid from data
    users[data.username] = data;
    io.emit('sendData', users);

  });

  console.log("socket.on", socket.on);
  console.log("a user connected: ", socket.id);

  socket.emit("init", { data: "hello world" });
  // socket.on('sendData', data => {
  //   console.log(data);
  //   // add userid from data
  //   const users = [];
  //   users.push(data);
  //   socket.broadcast.emit('backData', users);
  // });

  // socketID and username matching
  socket.on("SET USERNAME", (obj) => {
    //Login.jsx 의 setUser(res.data.userName)
    const username = obj.username;
    const socketid = obj.socketID;
    currentUsers[username] = socketid;
    // socket.join(loginRoom)
    const alluserNames = Object.keys(currentUsers); // {username : socket.id}
    console.log("AFTER LOGIN, SET USER NAME AND SOCKET ID PAIR", currentUsers);
    alluserNames.forEach((name) => {
      // name = moon, mike, heesoo
      console.log("USERNAME: ", name, "CURRENT USERS:", currentUsers[name]);
      // const sortedName = alluserNames.sort()
      io.to(currentUsers[name]).emit("all user names", { "users": alluserNames }); // App.jsx & Recipients.jsx 로 보내기
    }); // {"users": [name1, name2] }
  });

  // receive message
  socket.on("NEW MESSAGE", (e) => {
    console.log(e);
    // all users
    io.emit("PASS", "PASS");
  });

  socket.on("PRIVATE", (obj) => {
    // obj = {nickname, content: "", recipient: recipient}
    // nickname = 보내는사람
    // content = 내용
    // recipient = 받는사람
    // const Name target
    const responseData = {
      ...obj,
      type: "PRIVATE",
      time: new Date()
    };


    // const content = obj.content;
    const recipient = obj.recipient;
    const senderSocketID = obj.senderSocketId;

    const recipientSocketId = currentUsers[recipient.value]; // get target's socketid
    console.log("SENDERSOCKETID", senderSocketID);
    console.log(currentUsers); //////
    io
      .to(recipientSocketId)
      .emit("PRIVATE", responseData);
    io
      .to(senderSocketID)
      .emit("PRIVATE", responseData);
  });

  /* ADDED FROM socket/index.js */

  socket.on("JOIN_ROOM", (requestData) => {
    // 콜백함수의 파라미터는 클라이언트에서 보내주는 데이터.
    // 이 데이터를 소켓 서버에 던져줌.
    // 소켓서버는 데이터를 받아 콜백함수를 실행.
    socket.join(roomName); // user를 "room 1" 방에 참가시킴.
    const responseData = {
      ...requestData,
      type: "JOIN_ROOM",
      time: new Date(),
    };


    // "room 1"에는 이벤트타입과 서버에서 받은 시각을 덧붙여 데이터를 그대로 전송.
    io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
    // 클라이언트에 이벤트를 전달.
    // 클라이언트에서는 RECEIVE_MESSAGE 이벤트 리스너를 가지고 있어서 그쪽 콜백 함수가 또 실행됌. 서버구현 마치고 클라이언트 구현은 나중에.
    console.log(
      `JOIN_ROOM is fired with data: ${JSON.stringify(responseData)}`
    );
    // io.to(roomName).emit("all user names", "jasklefjl;ksajv@@@@@")
  });

  socket.on("UPDATE_NICKNAME", (requestData) => {
    const responseData = {
      ...requestData,
      type: "UPDATE_NICKNAME",
      time: new Date(),
    };
    io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
    console.log(
      `UPDATE_NICKNAME is fired with data: ${JSON.stringify(responseData)}`
    );
  });

  // receive.message는 ChatRoom.jsx 에서 defined
  // --------------- SEND MESSAGE ---------------
  socket.on("SEND_MESSAGE", (requestData) => {
    console.log("I got a message");
    //emiting back to receive message in line 67
    const responseData = {
      ...requestData,
      type: "SEND_MESSAGE",
      time: new Date(),
    };
    // SVGPreserveAspectRatio.to(roomName).emit
    io.emit("RECEIVE_MESSAGE", responseData);
    //responseData = chat message
    //@@@@@@ ChatRoom.jsx line 21
    // console.log(
    //   `"SEND_MESSAGE" is fired with data: ${JSON.stringify(responseData)}`
    // );
  });

  /* 오브젝트에서 종료되는 유저 삭제 */
  socket.on("disconnect", () => {
    console.log("DISCONNECT", socket.id);
    const alluserNames = Object.keys(currentUsers);
    alluserNames.forEach((name) => {
      if (currentUsers[name] === socket.id)
        delete currentUsers[name];
    }); // {"users": [name1, name2] }
    console.log("CURRENT USERS", currentUsers);
    io.emit("all user names", { "users": alluserNames }); // App.jsx & Recipients.jsx 로 보내기
  });
});

//
app.get("/", (req, res) => {
  // 8000
  res.json({ connected : "start" });
});

// 로그인 정보 리퀘스트 .. 진행중
app.post("/login", (req, res) => {
  // client sending
  console.log("login request", req.body);
  // req.body = {userEmail: '', userPassword: ''}

  const email = req.body.userEmail;
  const password = req.body.userPassword;

  // and password.. userName=$1 AND userpassword=$2
  return pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password],
    (err, res_1) => {
      if (err) throw err;
      console.log(res_1.rows);
      if (res_1.rows[0]) {
        // user exist
        const userInfo = res_1.rows[0];
        const userName = userInfo.username;
        const avatar = userInfo.avatar_id;
        console.log(res_1.rows[0]); // id: 3, username: "mike", password: "mike", email: "test2@test.com", avatar_id: 1
        const userID = res_1.rows[0].id;
        // find languages
        pool.query(
          "SELECT * FROM user_language WHERE user_id=$1",
          [userID],
          (err, res_2) => {
            const userLanguages = [];
            if (err) throw err;
            if (res_2.rows.length > 0) {
              console.log("find user's languages", res_2.rows);
              res_2.rows.forEach((obj) => {
                userLanguages.push(obj.language_id);
              });
              const loginUserData = {
                userName,
                avatar,
                userLanguages,
              };
              res.status(201).send(loginUserData); //object - username, avatar, language
            } else {
              console.log("No available language", res_2.rows);
            }
          }
        );
      } else {
        // no matching user
        res.status(201).send(false);
      }
    }
  );
});

app.post("/register", (req, res) => {
  console.log("post register request", req.body);
  const userName = req.body.userInfo.userName;
  const userPassword = req.body.userInfo.userPassword;
  const userEmail = req.body.userInfo.userEmail;
  const userLanguages = req.body.userInfo.userLanguages;
  const userAvatar = req.body.userInfo.userAvatar;
  console.log("userPassword", userPassword);
  pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [userName, userEmail],
    (err, res_1) => {
      if (err) throw err;
      console.log(res_1.rows[0]);
      if (res_1.rows[0]) return res.status(201).send("existing data");
    }
  );
  pool.query(
    "INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [userName, userPassword, userEmail, userAvatar],
    (err, result) => {
      if (err) throw err;
      console.log("new user registered");
      pool.query(
        "SELECT id FROM users WHERE username = $1",
        [userName],
        (err, res_2) => {
          console.log("new user's user ID", res_2.rows);
          const newUserID = res_2.rows[0].id;
          userLanguages.forEach((lang_id) => {
            if (lang_id) {
              console.log(lang_id);
              pool.query(
                "INSERT INTO user_language (user_id, language_id) VALUES ($1, $2) RETURNING *",
                [newUserID, lang_id],
                (err, res_3) => {
                  if (err) throw err;
                  console.log("new user's language data added", res_3.rows);
                }
              );
            }
          });
        }
      );
    }
  );
  res.status(201).send({ userName, userEmail, userLanguages, userAvatar });
});

httpServer.listen(PORT, () => {
  console.log(
    `Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`
  );
});
