import React from "react";
import Cookies from "universal-cookie";



const { io } = require("socket.io-client");
const socket = io.connect(process.env.PORT, {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttemps: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
}); // same domain
// import {Outlet} from "react-router-dom";

export default function Register() {
  const cookies = new Cookies();
  // // 쿠키 삭제 테스트
  // // 키 업 => 쿠키 삭제
  // document.addEventListener("keyup", () => {
  //   cookies.remove("test", {path: '/'})
  // });
  return (
    <>
      <form action="/game" method="GET" id="form_login">
      {/* <form> */}
        EMAIL :{" "}
        <input
          name="email"
          id="register_email"
          rows="1"
          placeholder="EMAIL"
          typeof="email"
        ></input>
        <br />
        PASSWORD :{" "}
        <input
          name="password"
          id="register_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
        ></input>
        <br />
        <button
          onClick={(e) => {
            const userData = []
            const target = document.querySelectorAll("input");
            // console.log(target)
            target.forEach((each) => {
              userData.push(each.value)
              // console.log(each.value);
            });
            // if password and confirmation are not matched, alert and return
            // e.preventDefault(); // block form action
            // alert("invalid input")
            // } else if (userData[2] !== userData[3]) {
            // e.preventDefault(); // block form action
            // alert("mismatched password");
            // } else {
            // if all good, pass all datas to server
            // console.log("userData", userData);
            socket.emit("login", userData);
            // 데이터 validation ... is true? else preventdefault
            // 쿠키 세팅
            // const target = document.querySelectorAll("input");

            cookies.set(target[0].value, target[1].value, { path: "/" });
            // cookies.set(target[0].value, target[1].value);
            // console.log(cookies.get("test"));
          }}
        >
          Login
        </button>
      </form>
      {/* <Outlet /> */}
    </>
  );
}
