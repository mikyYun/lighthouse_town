/** USE QUERY */
const poolGroup = require("./coding_buddy_db");
const { pool, getUserInfo, createUser } = poolGroup;

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

/** INTEGRATING Socket.io */
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_URL,
    Credential: true,
  }
});
const { createAdapter } = require("@socket.io/postgres-adapter");
const sessionMiddleware = session({
  secret: "codding_buddy",
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

io.on("connection", (socket) => {
  const session = socket.request.session;
  session.save();
  console.log("SOCKET CONNECTED")
})



/** REGISTER */
app.post("/register"), (req, res) => {

  console.log("REGISTER", req)
  // return createUser(body, res);
  return createUser(req, res);
};

/** LOGIN */
app.post("/login", (req, res) => {
  console.log("LOGIN")
  return getUserInfo(req, res);
});


/** SERVER RUNNING */
httpServer.listen(PORT, () => {
  console.log(`SERVER_REFACTOR.JS || Server running on port ${PORT}`);
});