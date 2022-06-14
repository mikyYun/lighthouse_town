import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";

// const { io } = require("socket.io-client");
// const socket = io.connect("http://localhost:8000", {
//   reconnectionDelay: 1000,
//   reconnection: true,
//   reconnectionAttemps: 10,
//   transports: ["websocket"],
//   agent: false,
//   upgrade: false,
//   rejectUnauthorized: false,
// }); // same domain
// no localhost in client
// import socket from "../Sockets";

export function RegistrationChecker(val, e) {
  const cookies = new Cookies();
  const userData = [];
  const languages = [];
  let avatar = '';
  for (let i = 0; i < val.length; i++) {
    if (i <= 3) { // default information
      // user data
      // setUserData((prev) => ([...prev, val[i].value]))
      userData.push(val[i].value);
    } else if (i > 3 && i < 9) { //languages
      let lang_id;
      switch (val[i].value) {
        case "HTML":
          lang_id = 1;
          break;
        case "CSS":
          lang_id = 2;
          break;
        case "JavaScript":
          lang_id = 3;
          break;
        case "React":
          lang_id = 4;
          break;
        case "Ruby":
          lang_id = 4;
          break;
      }
      languages.push(lang_id);
    } else {
      if (val[i].value === 'M') {
        // setAvatar(1)
        avatar = 1;
      } else {
        // setAvatar(2)
        avatar = 2;
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
// res.send
    console.log("userData", userData);
    console.log("languages", languages);
    console.log("avatar", avatar);
    // send
    // return { userData, languages, avatar }
    // socket.emit("REGISTERED", { userData, languages, avatar }, (callback) => {
    //   console.log(callback);
    //   cookies.set("username", callback);
    // });
    // , (res) => {
      // e.preventDefault()
      // return true
    //   console.log("CALLBACK", res)
    // })
    // , (res) => {
    //   console.log("RES.USERNAME", res.username);
    //   return res.username
    // });
    // return socket.on("REGISTRATIPN SUCCESS", (cookieInfo) => {
    //   console.log("success", cookieInfo); // username
    //   return cookieInfo;
    // });
  }
  // receiv
  // socket.on("REGISTERED USER", (data) => {

  // })
}

export function loginHandler(loginUserData) {
  // socket.emit("LOGIN", { userData: loginUserData });
  // return socket.on("SUCCESS", (msg) => {
  //   // console.log(msg) // msg = 유저 이메일
  //   return msg;
  // });

}

export function setCookies() {
  // socket.emit("SET COOKIES", (data) => {
  //   console.log(data);
  //   return data;
  // });

  return '';
}

