import { useState } from 'react';
const { io } = require("socket.io-client");
const socket = io.connect("http://localhost:4000", {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttemps: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
}); // same domain
// import socket from "../Sockets";

export function RegistrationChecker(val, e) {
  // const {userData, setUserData} = useState([]);
  // const {languages, setLanguages} = useState([]);
  // const {avatar, setAvatar} = useState();
  console.log("TEST");
  // socket.emit("LOGIN", val);
  const userData = [];
  const languages = [];
  let avatar = '';
  for (let i = 0; i < val.length; i++) {
    if (i <= 3) { // default information
      // user data
      // setUserData((prev) => ([...prev, val[i].value]))
      userData.push(val[i].value);
    } else if (i > 3 && i < 9) { //languages
      // programming languages
      // if checked
      // if (val[i].checked && i < 9)
      // setLanguages((prev) => ([...prev, val[i].value]))
      languages.push(val[i].value);
    } else {
      if (val[i].value === 'M') {
        // setAvatar(1)
        avatar = 1
      } else {
        // setAvatar(2)
        avatar = 2
      }
    }
  }
  // email, name, password length check
  if (userData[0].length < 1 || userData[1].length < 2 || userData[2].length < 2) {
    // if password and confirmation are not matched, alert and return
    e.preventDefault(); // block form action
    alert("invalid input");
  } else if (userData[2] !== userData[3]) {
    e.preventDefault(); // block form action
    alert("mismatched password");
  } else {
    // if all good, pass all datas to server

    console.log("userData", userData);
    console.log("languages", languages);
    console.log("avatar", avatar);
    // send
    socket.emit("REGISTERED", { userData, languages, avatar });
    return socket.on("SUCCESS", (msg) => {
      return msg;
    });
  }
  // receiv
  // socket.on("REGISTERED USER", (data) => {

  // })
}

export function loginHandler(loginUserData) {
  socket.emit("LOGIN", { userData: loginUserData });
  return socket.on("SUCCESS", (msg) => {
    // console.log(msg) // msg = 유저 이메일
    return msg;
  });

}