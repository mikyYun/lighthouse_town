// npm i express nodemon socket.io
// server running with nodemon : npm run dev
const PORT = process.env.PORT || 5000;

// express, morgan, nodemo
const express = require('express');
const app = express();
// socket.io
// step 1. declare socket.id -> run server to check
const Server = require('socket.io');
// step 2. require http
const { createServer } = require("http");
// step 3. wrap the app in the createServer
// listen from http, not app
const httpServer = createServer(app);

const io = Server(httpServer); // optional second params callback

const randomStringGenerator = (Math.random() + 1).toString(36).substring(7);


// someone connedted
// socket is json format
let users = [];
io.on("connection", (socket) => {
  // console.log('socket is ', socket)
  console.log("Someone has been connedted!");
  // first params stands for MESSAGE TYPE
  const randName = (Math.random() + 1).toString(36).substring(2);
  // 중복이름 변경
  const renaming = (randName) => {
    if (users.includes(randName)) {
      renaming();
    } else {
      users.push(randName);
    }
  };
  // https://socket.io/docs/v4/emit-cheatsheet/
  renaming(randName);
  // users = [] // users reset
  socket.emit('greeting', { randName, users }); // current user 에게만
  socket.name = randName;
  socket.broadcast.emit("New User Connection", users); // 전체
  
  socket.on("disconnect", (data) => {
    // console.log(data)
    console.log(`${socket.name} has disconnected!!`);
    users = users.filter(name => name !== socket.name);
    socket.broadcast.emit("DISCONNECT", socket.name); // 전체
  });
  // console in server
  socket.on("CLICKED", (data) => {
    console.log("Someone has clicked the button")
  } )

});


app.get("/test", (req, res) => {
  res.json({ test: "start" });
});

// app.get("/test", (req, res) => {
//   res.json({ test: "start" });
// });

httpServer.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});