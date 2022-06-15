// server running with nodemon : npm run dev
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const express = require('express');
const session = require('express-session');
const app = express();
const httpServer = require("http").createServer(app);
// const { createServer } = require("http");
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
const { createAdapter } = require('@socket.io/postgres-adapter'); //ap.get, 안써도 socket.io 안에서 직접 postgres 연결이 가능. root path 따로 설정 불필요.


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

// httpServer.adapter(createAdapter.pool)
// console.log(io.adapter(pool))

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.adapter(createAdapter(pool));

io.on("connection", (socket) => {
  console.log('a user connected: heesoo');
  //
  const session = socket.request.session;
  session.save();
  const req = socket.request;
  const userName = {};

  socket.emit("init", { data: 'hello world' });


  socket.on("LOGIN", (data) => {
    // userData = {"userEmail" : ~~, "userPassword" : ~~}
    console.log("LOGIN", data);
    socket.emit("SUCCESS", data.userData.userEmail); //  클라이언트에 유저 이메일만 전송
    socket.request.session.reload((err) => {
      if (err) {
        return console.log("ERROR");
      }
      console.log("clicked", socket.request.session);
      // userName["userEmail"] = userData.userEmail;
    });
  });
  //     // 로그인 페이지에서 들어오는 정보
  //     // console.log("LoginInformation", userData);
  //     req.session.save(); //ASK WHAT IT DOES?
  //   });
  //   // compare userdata and pass data to client


  //   const users = {}; // only validated user data 나중에 데이터베이스로..
  //   console.log("Someone has been connected!");
  //   socket.broadcast.emit("New User Connection", users); // 전체

  //   socket.on("disconnect", (data) => {
  //     // console.log("socket request", socket.request.session);
  //     socket.request.session = null;

  //     console.log(`A user has disconnected!!`);
  //     // users = users.filter(name => name !== socket.name);
  //     // socket.broadcast.emit("DISCONNECT", socket.name); // 전체
  //   });
  //   // console in server
  //   socket.on("CLICKED", (data) => {
  //     console.log("Someone has clicked the button");
  //   });

  //   // registration // 나중에 데이터테이블에 넣을 수 있게 바꿔야함
  //   // socket.on("REGISTERED", (data) => {
  //   //   // data = {[userData(email, name, password)], [selectedLanguages]}
  //   //   console.log("use asks registration");
  //   //   // console.log(data);
  //   //   // console.log(data.selectedLanguages);
  //   //   users["name"] = data.userData[1];
  //   //   users["email"] = data.userData[0];
  //   //   users["password"] = data.userData[2];
  //   //   users["languagues"] = data.selectedLanguages;
  //   //   // console.log(users);
  //   // });
  //   socket.on("REGISTERED", (data) => {
  //     console.log("registering", data);



  //     // 프론트에서 받은 데이터가 이미 데이터베이스에 존재하는지 확인
  //     pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [data.userData[1], data.userData[2]], (err, result) => {
  //       if (err) throw err;
  //       console.log(result.rows[0])
  //     })
  //     pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [data.userData[1], data.userData[2], data.userData[0], data.avatar], (err, result) => {
  //       if (err) throw err;
  //       res.status(201).send(`User added with ID: ${result.rows[0].id}`)
  //     });
  //     pool.query("INSERT INTO user_language (user_id, language_id) VALUES (ARRAY [$1]) RETURNING *", [data.languages], (err, result) => {
  //       if (err) throw err;
  //       res.status(201).send('User added')
  //     })
  //     return socket.emit("SUCCESS", data.userData[0])
  //     // app.post('/register', db.createUser);
  //     // 유저 등록 데이터 받음. db 에 저장하기
  //     // app.post('/delete/:id', db.createUser);
  //     // app.post('/', db.deleteUser);
  //     // app.post('/', db.createUser);
  //     // app.post('/', db.createUser);
  //     // app.post('/users', db.createUser);
  //     // '/'
  //     // 'login'
  //     // 'register'
  //     // 'game'

  //   });
  //   // registration 성공했으면 프론트에 ok 보내줌 -> 애니메이션 실행하고 로그인페이지로... 다음에//
  //   // socket.emit('REGISTRATION SUCCESS', true); // current user 에게만

});


// 서버에서 app.get 으로 가는건 서버의 루트(local..) / .... 으로 감
app.get("/", (req, res) => { // server url -> 8000
  res.json({ test: "start" });
});

// 로그인 정보 리퀘스트 .. 진행중
app.post("/login", (req, res) => {
  // client sending
  console.log(req.body);
  const username = req.body.username;
  // and password.. username=$1 AND userpassword=$2
  return pool.query("SELECT * FROM users WHERE username=$1", [username], (err, response) => {
    if (err) throw err;
    // res.status(201).send('User added');
    res.json(response.rows);
    // response.rows[0] ==> obj
    console.log("new user's language data added", response.rows[0]);
  });
});
//"/login" => local 8000/login
app.post("/register", (req, res) => {
  console.log("post register request", req.body); // {userInfo}
  // const userInfo = {
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
  pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [userName, userEmail], (err, result) => {
    if (err) throw err;
    console.log(result.rows[0]);
    if (result.rows[0]) return res.status(201).send("existing data");
  });
  pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [userName, userPassword, userEmail, userAvatar], (err, result) => {
    if (err) throw err;
    console.log("new user registered");
    // res.status(201).send(`User added with ID: ${result.rows[0].id}`);
    pool.query("SELECT id FROM users WHERE username = $1", [userName], (err, res) => {
      console.log("new user's user ID", res.rows);
      const newUserID = res.rows[0].id;
      userLanguages.forEach(lang_id => {
        if (lang_id) {
          console.log(lang_id);
          pool.query("INSERT INTO user_language (user_id, language_id) VALUES ($1, $2) RETURNING *", [newUserID, lang_id], (err, res) => {
            if (err) throw err;
            console.log("new user's language data added", res.rows);
          });
        }
      });
    });
  });
  res.status(201).send({userName, userEmail, userLanguages, userAvatar});
});

//   pool.query("INSERT INTO user_language (user_id, language_id) VALUES (ARRAY [$1]) RETURNING *", [userLanguages], (err, result) => {
//     if (err) throw err;
//     // res.status(201).send('User added');
//     console.log("new user language datas inserted")
//   });
//   if (err) throw err;
//   res.status(201).send({userName, userEmail, userLanguages, userAvatar})
//   // return socket.emit("SUCCESS", data.userData[0]);
// // })
// });

httpServer.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`);
  // console.log(`Server Started on port ${PORT}in ${ENV} mode`);
});