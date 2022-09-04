/** USE QUERY */
// import { pool, filterEssentials, getUsers, getUserById, createUser, updateUser, deleteUser } from "./coding_buddy_db";
const poolGroup = require("./coding_buddy_db");
const pool = poolGroup.pool;
const getUserInfo = poolGroup.getUserInfo;
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
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
/** ADAPTER TO USE QUERIES */
io.adapter(createAdapter(pool));

/** SET EXPRESS TO USE PACKAGES */
app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/** LOGIN */
app.post("/login", (req, res) => {
  return getUserInfo(req, res);
});


/** SERVER RUNNING */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});