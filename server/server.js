
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

// ================ HELPER FUNCS ================= //
const getUserLang = (userID) => {
  return pool.query(
    `SELECT user_id, languages.language_name 
    from user_language

    JOIN languages 
    ON languages.id = user_language.language_id

    WHERE user_id = $1`,
    [userID]
  )
    .then((result) => {
      return result.rows.map((row) => row.language_name) //return array of languages
    }
    )
}


const { createAdapter } = require("@socket.io/postgres-adapter"); //app.get, 안써도 socket.io 안에서 직접 postgres 연결이 가능. root path 따로 설정 불필요.
const sessionMiddleware = session({
  secret: "coding_buddy",
  cookie: { maxAge: 60000 },
});
const { getOneUserLanguages } = require("./coding_buddy_db");
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


// store all users' socket id with username key-value pair
let currentUsers = {}; // => {username : socket.id}
const usersInRooms = {};



io.on("connection", (socket) => { //여기서 이미 socket id generation
  console.log('CLIENT CONNECTED', socket.id)
  const roomName = "plaza";
  const session = socket.request.session;
  session.save();

  //waiting for the client to send the request
  socket.on("friendsList", ({ newSocketID, user, userID }) => {
    // check this id is in currentUsers Object
    const alluserNames = Object.keys(currentUsers);
    const currentUser = alluserNames.find((username) => currentUsers[username] === newSocketID)

    //@@upgrade later @mike 
    if (!currentUser) return console.log('user not found', 'allusernames', alluserNames, 'newSocketID', newSocketID)

    pool.query(`
      SELECT users.id, users.username, added_users.id AS friend_id, added_users.username AS friend_name

      FROM users

      JOIN favorites
      ON users.id = favorites.added_by

      JOIN users added_users
      ON added_users.id = favorites.added

      WHERE added_by = $1;
  `, [userID],
      (err, result) => {
        if (result.rows[0]) {
          // if you have friends
          const allusersTable = result.rows; // [ {friend1}, {friend2} ]
          const promises = allusersTable.map(
            async (row) => { //add 'ASYNC' in front of the arrow function.
              //ASYNC FUNCTION, YOU ARE RETURNING A PROMISE.
              row.languages = await getUserLang(row.friend_id) //to make it synchronous // returning one promise
              // we call promise function for all friends. 
              // we need to ensure to resolve for ALL friends.
            }
          )
          Promise.all(promises) //wait for all promises to resolve
            .then((res) => {
              console.log("allusersTable", allusersTable)
              socket.emit("friendsListBack", allusersTable);
            })
        }
      });


    // socket.on("reconnection?", (e) => {
    //   console.log("RECONENCTION REQUEST", e);
    //   // let reconnection = true
    //   // console.log("THIS IS RECONNECTION", e);
    //   // e.username, e.newSocketId
    //   // console.log("before",currentUsers)
    //   if (currentUsers[e.username]) {
    //     // 현재 currentUsers 에 같은 유저네임이 존재하면 => 사용중인 유저네임 && disconnect 되지 않았다면
    //     socket.emit("DENY CONNECTION", false);
    //     // callback("return")
    //   } else {
    //     currentUsers[e.username] = e.newSocketId; // update
    //     const alluserNames = Object.keys(currentUsers); // get keys arr
    //     // alluserNames.forEach((name) => {
    //     // if (currentUsers[name] === socket.id)
    //     // delete currentUsers[name];
    //     // }); // {"users": [name1, name2] }
    //     // 현재유저 이름은 뺌
    //     // alluserNames.filter(nm => nm !== e.username)
    //     // console.log("CURRENT USERS", alluserNames);
    //     socket.emit("all user names", { "users": alluserNames });
    //   }
    // });

    // use object
    // socket.emit("init", {data: 'hello world'})



  })

  socket.on('sendData', data => { //이 data는 어디서옴?

    const { userState, room, removeFrom } = data; // 이 room은 어디서 어떻게 define 돼있음?

    // console.log('got data', data);
    if (!usersInRooms[room]) {
      usersInRooms[room] = {}
    }
    //when usersInRooms have some properties
    for (const rooms in usersInRooms) {
      // console.log(usersInRooms[rooms])
      for (const user in usersInRooms[rooms]) { //이건 왜 room아니고 rooms 임?
        if (room !== rooms && userState.username === user) {
          delete usersInRooms[rooms][userState.username] //뭐하는 코드?
        }
      }
    }
    usersInRooms[room][userState.username] = userState;
    // console.log('usersInROMMs', usersInRooms)

    io.emit('sendData', { usersInRooms, room }); // 다시 Canvas.jsx -> const newCharactersData = data;

  });



  // socketID and username matching triggered when user login

  //@@THIS IS NOT FIRED
  socket.on("SET USERNAME", (obj) => {
    //Login.jsx 의 setUser(res.data.userName)
    console.log('obj', obj)
    const { username, socketID } = obj;
    console.log("RECONNECTION", username, socketID)

    currentUsers[username] = socketID;
    console.log('currentusers in server.js', currentUsers)
    pool.query(
      "SELECT id, username AS name, email, avatar_id FROM users",
      (err, res) => {
        // res.rows => {id: , name: , email: , avatar_id}
        const allUsersObj = res.rows;
        pool.query(
          "SELECT languages.id, user_id, language_name FROM user_language JOIN languages ON language_id=languages.id",
          (err, res_1) => {
            // res.rows_1 => {id(languageID): , user_id: , language_name: }
            const userIDAndLang = res_1.rows;
            const loginUsersData = {}
            allUsersObj.map(user => {
              if (currentUsers[user.name]) {
                loginUsersData[user.name] = {
                  // socketID: socketID,
                  email: user.email,
                  avatar_id: user.avatar_id,
                  languages: []
                }
                userIDAndLang.map(lang => {
                  if (user.id === lang.user_id) {
                    loginUsersData[user.name].languages.push(lang.language_name)
                  }
                })
              }
            });
            // console.log(loginUsersData)
            const alluserNames = Object.keys(loginUsersData);
            alluserNames.forEach((name) => {
              io.to(currentUsers[name])
                .emit("all user names", { "users": loginUsersData });// all user names
            }
            );
          }
        );


        // const alluserNames = Object.keys(currentUsers); 
        // alluserNames.forEach((name) => {
        //   io.to(currentUsers[name])
        //     .emit("all user names", { "users": alluserNames });
      }); // {"users": [name1, name2] }
    // }
  });

  // ADD FRIEND
  // socket.on("add friend", {username, addFreindName})
  socket.on("add friend", ({ username, addFriendName, userID }) => {
    // console.log("ADD FRIEND", nameObj)
    pool.query(
      "SELECT id, username FROM users WHERE username=$1", [addFriendName],
      (err, res) => {
        // res.rows => users table [{id: , username: ,....}]
        const targetID = res.rows[0].id;
        // console.log("target users id", targetID);
        pool.query(
          "INSERT INTO favorites (added_by, added) VALUES ($2, $1)", [userID, targetID]
        );
        // console.log(targetID);
        /////////////////////////////////////////
        /////////////////////////////////////////

        pool.query("SELECT * FROM user_language JOIN languages ON user_language.language_id=languages.id WHERE user_id=$1", [targetID],
          (err, res) => {
            const languages = [];
            res.rows.map(obj => {
              languages.push(obj.language_name);
            });
            const newFriendLanguageObj = {};
            newFriendLanguageObj[addFriendName] = { languages };
            // console.log("WHAT", addFriendName, {languages});
            // socket.emit("updateFriendsList", newFriendLanguageObj);
            socket.emit("updateFriendsList", { newFriendName: addFriendName, languages: languages });
          });


        // pool.query("SELECT * FROM user_language WHERE user_id=$1", [targetID],
        //   (err, res) => {
        //     const userLanguageTable = res.rows;
        //     const languageNames = []
        //     // console.log(row)
        //     // return changeToLanguageName(row.id);
        //     userLanguageTable.map(row => {
        //     return pool.query("SELECT * FROM languages WHERE id=$1", [row.language_id],
        //     (err, res) => {
        //           console.log("RES",res.rows[0].language_name)
        //           return languageNames.push(res.rows[0].language_name)
        //           // return res.rows[0].languageName;
        //         });
        //     });
        //     console.log("THIS",languageNames)
        //     // return userLanguageTable;
        //     socket.emit("updateFriendsList", userLanguageTable)
        //   });
        // console.log(getOneUserLanguages(targetID, addFriendName))
        // getOneUserLanguages(targetID, addFriendName);
        // this method will return array of language names
        // send this array to update friendList

      }
    );

    // pool.query(
    //   "SELECT * FROM favorites",
    //   (err, res) => {
    //     // console.log(res.rows)
    //   }
    // );
  });

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

    socket.join(roomName); // user를 "plaza" 방에 참가시킴.
    const responseData = {
      ...requestData,
      type: "JOIN_ROOM",
      time: new Date(),
    };

    io.to(roomName).emit("RECEIVE_MESSAGE", responseData);

    console.log(
      `JOIN_ROOM is fired with data: ${JSON.stringify(responseData)} `
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
      `UPDATE_NICKNAME is fired with data: ${JSON.stringify(responseData)} `
    );
  });

  // --------------- SEND MESSAGE ---------------
  socket.on("SEND_MESSAGE", (requestData) => {
    const responseData = {
      ...requestData,
      type: "SEND_MESSAGE",
      time: new Date(),
    };
    io.emit("RECEIVE_MESSAGE", responseData);

  });

  /* 오브젝트에서 종료되는 유저 삭제 */
  socket.on("disconnect", () => {
    const alluserNames = Object.keys(currentUsers);
    let disconnectedUsername
    alluserNames.forEach((name) => {
      if (currentUsers[name] === socket.id)
        delete currentUsers[name];
      disconnectedUsername = name
    }); // {"users": [name1, name2] }
    console.log("Server.js - A USER DISCONNECTED - CURRENT USERS", currentUsers);
    io.emit("update login users information", { disconnectedUser: disconnectedUsername }); // App.jsx & Recipients.jsx 로 보내기
  });
});;

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
//           "SELECT added_by FROM favorites WHERE addedd=$1",
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
