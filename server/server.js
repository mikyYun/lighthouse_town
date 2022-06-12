//hey
// server running with nodemon : npm run dev
const PORT = process.env.PORT || 8000;
const express = require('express');
const session = require('express-session');
const app = express();
// socket.io
// step 1. declare socket.id -> run server to check
const Server = require('socket.io');
// step 2. require http
const { createServer } = require("http");
// step 3. wrap the app in the createServer
// listen from http, not app
const httpServer = createServer(app);
const io = Server(httpServer);
const sessionMiddleware = session({ secret: 'codding_buddy', cookie: { maxAge: 60000 } });
app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
// someone connedted
// socket is json format
io.on("connection", (socket) => {
  // 
  const session = socket.request.session;
  session.save();
  const req = socket.request;
  const userName = {};

  socket.on("LOGIN", (data) => {
    // userData = {"userEmail" : ~~, "userPassword" : ~~}
    console.log("LOGIN", data);
    socket.emit("SUCCESS", "Who are you");
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
  socket.on("REGISTERED", (data) => console.log(data));
  // registration 성공했으면 프론트에 ok 보내줌 -> 애니메이션 실행하고 로그인페이지로... 다음에//
  // socket.emit('REGISTRATION SUCCESS', true); // current user 에게만

});

// 서버에서 app.get 으로 가는건 서버의 루트(local..) / .... 으로 감
app.get("/", (req, res) => { // server url -> 8000
  res.json({ test: "start" });
});
// app.get("/login", (req, res) => {
//   console.log('login get')
// })
// path 체크.. localhost:5000/register 로 가면 콘솔, h1 테그 볼 수 있음
app.get("/register", (req, res) => {
  res.send('<h1>{ test: "start" }</h1>');
  console.log("GET/REGISTER");
});

httpServer.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});