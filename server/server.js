// server running with nodemon : npm run dev
require("dotenv").config();

const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const express = require('express');
const session = require('express-session');
const app = express();
const Server = require('socket.io');
const { createServer } = require("http");
const { createAdapter } = require('@socket.io/postgres-adapter')
const httpServer = createServer(app);
const io = Server(httpServer);
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
  // 
  const session = socket.request.session;
  session.save();
  const req = socket.request;
  const userName = {};

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

    // 로그인 페이지에서 들어오는 정보
    // console.log("LoginInformation", userData);
    req.session.save(); //ASK WHAT IT DOES?
  });
  // compare userdata and pass data to client


  const users = {}; // only validated user data 나중에 데이터베이스로..
  console.log("Someone has been connected!");
  socket.broadcast.emit("New User Connection", users); // 전체

  socket.on("disconnect", (data) => {
    // console.log("socket request", socket.request.session);
    socket.request.session = null;

    console.log(`A user has disconnected!!`);
    // users = users.filter(name => name !== socket.name);
    // socket.broadcast.emit("DISCONNECT", socket.name); // 전체
  });
  // console in server
  socket.on("CLICKED", (data) => {
    console.log("Someone has clicked the button");
  });

  // registration // 나중에 데이터테이블에 넣을 수 있게 바꿔야함
  // socket.on("REGISTERED", (data) => {
  //   // data = {[userData(email, name, password)], [selectedLanguages]}
  //   console.log("use asks registration");
  //   // console.log(data);
  //   // console.log(data.selectedLanguages);
  //   users["name"] = data.userData[1];
  //   users["email"] = data.userData[0];
  //   users["password"] = data.userData[2];
  //   users["languagues"] = data.selectedLanguages;
  //   // console.log(users);
  // });
  socket.on("REGISTERED", (data) => {
    console.log("registering", data);
    // 프론트에서 받은 데이터가 이미 데이터베이스에 존재하는지 확인
    pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [data.userData[1], data.userData[2]], (err, result) => {
      if (err) throw err;
      console.log(result.rows[0])
    })
    pool.query("INSERT INTO users (username, password, email, avatar_id) VALUES ($1, $2, $3, $4) RETURNING *", [data.userData[1], data.userData[2], data.userData[0], data.avatar], (err, result) => {
      if (err) throw err;
      res.status(201).send(`User added with ID: ${result.rows[0].id}`)
    });
    pool.query("INSERT INTO user_language (user_id, language_id) VALUES (ARRAY [$1]) RETURNING *", [data.languages], (err, result) => {
      if (err) throw err;
      res.status(201).send('User added')
    })
    return socket.emit("SUCCESS", data.userData[0])
    // app.post('/register', db.createUser);
    // 유저 등록 데이터 받음. db 에 저장하기
    // app.post('/delete/:id', db.createUser);
    // app.post('/', db.deleteUser);
    // app.post('/', db.createUser);
    // app.post('/', db.createUser);
    // app.post('/users', db.createUser);
    // '/'
    // 'login'
    // 'register'
    // 'game'

  });
  // registration 성공했으면 프론트에 ok 보내줌 -> 애니메이션 실행하고 로그인페이지로... 다음에//
  // socket.emit('REGISTRATION SUCCESS', true); // current user 에게만

});

///////////////////////////////////////////////////
///////////////////////////////////////////////////

// 데이터베이스 관리 => coding_buddy_db.js //

///////////////////////////////////////////////////
///////////////////////////////////////////////////

// 서버에서 app.get 으로 가는건 서버의 루트(local..) / .... 으로 감
app.get("/", (req, res) => { // server url -> 8000
  res.json({ test: "start" });
});
// app.get("/login", (req, res) => {
//   console.log('login get')
// })
// path 체크.. localhost:5000/register 로 가면 콘솔, h1 테그 볼 수 있음
// app.get("/register", (req, res) => {
//   res.send('<h1>{ test: "start" }</h1>');
//   console.log("GET/REGISTER");
// });

// db check // 이건 예시
// 데이터 REST -> cod 
// GET 모든 유저 정보 받아오기
// app.get('/users', db.getUsers)

// GET 유저 아이디로 한명만 찾기
// app.get('/users/:id', db.getUserById)

// POST 새로운 유저 생성
// app.post('/users', db.createUser)

// POST(PUT) 유저 정보 업데이트
// app.put('/users/:id', db.updateUser)

// POST(DELETE) 유저 삭제
// app.delete('/users/:id', db.deleteUser)

// 클라이언트에서 socket.emit 또는 io.... 로 유저 register 정보 받으면
// app.post('/users, db.createUser)  // 해서 데이터에 저장하고
// app.get('/users, db...) // 해서 필요한 정보 리턴시키고 그걸 클라이언트로 패스?



httpServer.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
  // console.log(`Server Started on port ${PORT}in ${ENV} mode`);
});




/* Moon's Chat Server

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const socketIo = require("socket.io")(server, { //????왜 괄호 두개
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// const socket = require("../chat-app/src/service/socket");
const socket = require("./socket");

const port = 4000;

// express의 미들웨어 사용 방식
app.get("/", (req, res) => {
  res.json({ test: "start" });
  console.log("this is server.js") //this appears in terminal
});

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // cors 미들웨어 사용
socket(socketIo);// /src/socket/index.js 의 socket으로 socketIo 객체를 전달

// homepage

server.listen(port, () => {
  console.log(
    `##### server is running on http://localhost:4000. ${new Date().toLocaleString()} #####`
  );
});

//코드를 위에서부터 보면 express로 만든 서버에 socket을 열어줬고 cors로 localhost:3000 url만 통신을 허용하도록 설정했습니다. src/socket은 아직 만들진 않았지만 이제 바로 만들 것이기 때문에 미리 작성해뒀습니다. src/socket.js 파일에서 소켓의 이벤트에 따른 로직들을 작성할 것입니다.

*/