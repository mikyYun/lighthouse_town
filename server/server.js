
//@@@@@@@socket ID SPELLING FIX!!

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

const usersInRooms = {};
// store all users' socket id with username key-value pair
let currentUsers = {}; // => {username : socket.id}


io.on("connection", (socket) => {
  const roomName = "room 1";
  const session = socket.request.session;
  session.save();

  socket.on("friendsList", (id) => {
    // id.socketID = new user's socketid
    const newSocketID = id.socketID;
    // check this id is in currentUsers Object
    const alluserNames = Object.keys(currentUsers);
    let existUsername;
    alluserNames.map(username => {
      if (currentUsers[username] === newSocketID) {
        // console.log(username)
        existUsername = username;
        return;
      } else {
        return false; // !!@@return false 아님?
      }
    });
    if (existUsername !== false) { // @@아니면 이렇게 쓰는 건? if (existUsername)
      pool.query("SELECT * FROM users", // {id: , username: , password: , email: , avatar: , lan_id: }
        // [existUsername],
        (err, res_1) => {
          if (err) throw err;
          if (res_1.rows[0]) { // 테이블이 존재하면
            const allusersTable = res_1.rows;
            let userID;
            allusersTable.map(obj => {
              if (obj.username === existUsername)
                userID = obj.id; // @@obj는 뭐임?
            });
            // user exist
            // const userID = res_1.rows[0].id;
            pool.query(
              // find added(followers) id
              "SELECT added_by FROM favorites WHERE added=$1",
              // {id: , following: , followed: }
              [userID],
              (err, res_2) => {
                console.log(res_2.rows)
                const usernames = [];
                const followedIds = []; // userid[1, 2, 3....]
                const followedInfo = {};
                res_2.rows.map(obj => {
                  followedIds.push(obj.added_by);
                });
                // console.log("!!",Object.keys(allusersTable))
                allusersTable.map(obj => {
                  if (followedIds.includes(obj.id)) {
                    // console.log(obj.id)
                    usernames.push(obj.username);
                    followedInfo[obj.username] = {};
                    followedInfo[obj.username]["languages"] = [];
                    // followedInfo[obj.username]["email"] = obj.email
                  }
                });
                // console.log(usernames);
                pool.query(
                  "SELECT * FROM user_language JOIN languages ON language_id=languages.id", (err, res_3) => {
                    res_3.rows.map(userLanguageID => { // @@ userLanguageName 으로 바꾸고 밑에서 =>// obj.language_name 으로 하기
                      // console.log("THIS", userLanguageID);
                      // console.log(allusersTable);
                      const nameMatching = allusersTable.find(obj => obj.id === userLanguageID.user_id).username;
                      if (followedIds.includes(userLanguageID.user_id)) {
                        followedInfo[nameMatching].languages.push(userLanguageID.language_name);
                        // console.log(userLanguageID.language_id)
                      }
                    });
                    // console.log("INFO", followedInfo)
                    socket.emit("friendsListBack", followedInfo);
                  }
                );
              }
            );
          }
        });
    }
  });



  socket.on("reconnection?", (e) => {
    console.log("RECONENCTION REQUEST", e)
    // let reconnection = true
    // console.log("THIS IS RECONNECTION", e);
    // e.username, e.newSocketId
    // console.log("before",currentUsers)
    if (currentUsers[e.username]) {
      // 현재 currentUsers 에 같은 유저네임이 존재하면 => 사용중인 유저네임 && disconnect 되지 않았다면
      socket.emit("DENY CONNECTION", false);
      // callback("return")
    } else {
      currentUsers[e.username] = e.newSocketId; // update
      const alluserNames = Object.keys(currentUsers); // get keys arr
      // alluserNames.forEach((name) => {
      // if (currentUsers[name] === socket.id)
      // delete currentUsers[name];
      // }); // {"users": [name1, name2] }
      // 현재유저 이름은 뺌
      // alluserNames.filter(nm => nm !== e.username)
      // console.log("CURRENT USERS", alluserNames);
      socket.emit("all user names", { "users": alluserNames });
    }
  });

  // use object
  // socket.emit("init", {data: 'hello world'})
  socket.on('sendData', data => {

    // data =
    //   {
    //     "userState": {
    //         "username": "moon",
    //         "x": 246,
    //         "y": 238,
    //         "currentDirection": 1,
    //         "frameCount": 0,
    //         "avatar": 1
    //     },
    //     "room": [
    //         "plaza"
    //     ]
    // }

    const { userState, room, removeFrom } = data;
    // console.log('got data', data);

    // inside of usersInRooms, if there is no room key, add the room key in it
    if (!usersInRooms[room]) {
      usersInRooms[room] = {};
    }

    // should remove the current user from the previous room
    if (removeFrom) {
      // console.log('Remove', usersInRooms[removeFrom][userState.username]);
      delete usersInRooms[removeFrom][userState.username];
    } else {
      // assign userState into each room
      usersInRooms[room][userState.username] = userState;
    }

    // console.log("COMPLETE", usersInRooms)
    // usersInRooms = {
    //     plaza: { moon: {moons state},
    //              heesoo: {heesoo's state}
    //      }


    // console.log(usersInRooms)
    io.emit('sendData', { usersInRooms, room }) // 다시 Canvas.jsx -> const newCharactersData = data;


    //  OLD CODE BEFORE WAKEEL MENTOR
  });




  // socketID and username matching
  socket.on("SET USERNAME", (obj) => {
    //Login.jsx 의 setUser(res.data.userName)
    const { username, socketID } = obj;

    // if (currentUsers[username]) {
    //   socket.emit("DENY CONNECTION", false)
    // } else {
    currentUsers[username] = socketID;
    // socket.join(loginRoom)
    const alluserNames = Object.keys(currentUsers); // {username : socket.id}
    // console.log("AFTER LOGIN, SET USER NAME AND SOCKET ID PAIR", currentUsers);

    // console.log("Server.js - currentUsers", currentUsers);

    alluserNames.forEach((name) => {
      // name = moon, mike, heesoo
      // console.log("App.js - name: ", name, " App.js - currentUsers: ", currentUsers[name]);
      // const sortedName = alluserNames.sort()
      io.to(currentUsers[name])
        .emit("all user names", { "users": alluserNames });// all user names
      //@@ App.js -> setOnline(usersOnline)

      // App.jsx & Recipients.jsx 로 보내기
    }); // {"users": [name1, name2] }
    // }
  });

  // ADD FRIEND
  // socket.on("add friend", {username, addFreindName})
  socket.on("add friend", ({username, addFriendName, userID}) => {
    // console.log("ADD FRIEND", nameObj)
    pool.query(
      "SELECT id, username FROM users WHERE username=$1",[addFriendName],
      (err, res) => {
        // res.rows => users table [{id: , username: ,....}]
        const targetID = res.rows[0].id
        console.log("target users id",targetID)
        pool.query(
          "INSERT INTO favorites (added_by, added) VALUES ($1, $2)", [userID, targetID]
        )
      }
    )

    pool.query(
      "SELECT * FROM favorites",
      (err, res) => {
        // console.log(res.rows)
      }
    )
  })

  // receive message
  socket.on("NEW MESSAGE", (e) => {
    // console.log(e);
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
    // console.log("SENDERSOCKETID", senderSocketID);
    // console.log(currentUsers);
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
    // console.log("Server.js - DISCONNECT", socket.id);
    const alluserNames = Object.keys(currentUsers);
    alluserNames.forEach((name) => {
      if (currentUsers[name] === socket.id)
        delete currentUsers[name];
    }); // {"users": [name1, name2] }
    // console.log("Server.js - DISCONNECT - CURRENT USERS", currentUsers);
    io.emit("all user names", { "users": alluserNames }); // App.jsx & Recipients.jsx 로 보내기
  });
});

//
app.get("/", (req, res) => {
  // 8000
  res.json({ connected: "start" });
});

// 로그인 정보 리퀘스트 .. 진행중
app.post("/login", (req, res) => {
  // client sending
  // console.log("login request", req.body);
  // req.body = {userEmail: '', userPassword: ''}

  const email = req.body.userEmail;
  const password = req.body.userPassword;

  // and password.. userName=$1 AND userpassword=$2
  return pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password],
    (err, res_1) => {
      if (err) throw err;
      // console.log(res_1.rows);
      if (res_1.rows[0]) {
        // user exist
        // get followeds
        const userInfo = res_1.rows[0];
        const userID = userInfo.id;
        const userName = userInfo.username;
        const avatar = userInfo.avatar_id;
        // console.log(res_1.rows[0]); // id: 3, username: "mike", password: "mike", email: "test2@test.com", avatar_id: 1
        // find languages

        pool.query(
          "SELECT * FROM user_language WHERE user_id=$1",
          [userID],
          (err, res_2) => {
            const userLanguages = [];
            if (err) throw err;
            if (res_2.rows.length > 0) {
              // console.log("find user's languages", res_2.rows);
              res_2.rows.forEach((obj) => {
                userLanguages.push(obj.language_id);
              });
              const loginUserData = {
                userName,
                avatar,
                userLanguages,
                userID
                // friends
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


// friends

app.post("/register", (req, res) => {
  const userName = req.body.userInfo.userName;
  const userPassword = req.body.userInfo.userPassword;
  const userEmail = req.body.userInfo.userEmail;
  const userLanguages = req.body.userInfo.userLanguages;
  const userAvatar = req.body.userInfo.userAvatar;
  pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [userName, userEmail],
    (err, res_1) => {
      if (err) throw err;
      // console.log(res_1.rows[0]);
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
          // console.log("new user's user ID", res_2.rows);
          const newUserID = res_2.rows[0].id;
          userLanguages.forEach((lang_id) => {
            if (lang_id) {
              // console.log(lang_id);
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

// app.post("/friends", (req, res) => {
//   const username = req.body.username;

//   // and password.. userName=$1 AND userpassword=$2
//   return pool.query(
//     "SELECT id FROM users WHERE username=$1",
//     [username],
//     (err, res_1) => {
//       if (err) throw err;
//       if (res_1.rows[0]) {
//         // user exist
//         const userID = res_1.rows[0].id;
//         pool.query(
//           // find followers id
//           "SELECT added_by FROM favorites WHERE followed=$1",
//           [userID],
//           (err, res_2) => {
//             const userLanguages = [];
//           }
//         );
//       } else {
//         // no matching user
//         res.status(201).send(false);
//       }
//     }
//   );
// });

httpServer.listen(PORT, () => {
  console.log(
    `Server Started on port ${PORT}, ${new Date().toLocaleString()} #####`
  );
});
