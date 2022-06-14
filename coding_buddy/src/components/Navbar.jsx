import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";
const logo = require("../img/lighthouse.png");

let clearCookie = false;
function Navbar() {
  // const [history, setHistory] = useState();
  const cookies = new Cookies();
  const currentCookie = Object.keys(cookies.getAll());
  if (clearCookie) {
    console.log("clear cookies");
    currentCookie.forEach((each) => {
      cookies.remove(each, { path: "/" });
    });
    clearCookie = !clearCookie;
  }
  return (
    <nav className="navigation">
      <Link to="/" onClick={() => (clearCookie = true)}>
        <img className="logo_img" src={logo} alt="Lighthouse"></img>
      </Link>
      <a href="djsaf.facebook.sdfkajle"></a>
      <p className="nav_home">
        <Link to="/" onClick={() => (clearCookie = true)}>
          Home
        </Link>
      </p>
      {/* <p className="nav_sockets">
          <Link to="/sockets">Sockets</Link>
        </p> */}
      <p className="nav_game">
        <Link to="/game">Game</Link>
      </p>
      <p className="nav_chat">
        <Link to="/chat">Chat</Link>
      </p>
      {/* {true ? "test" : "no"} */}
      <p className="nav_register">
        <Link to="/register" onClick={() => (clearCookie = true)}>
          Register
        </Link>
      </p>
      <p className="nav_login">
        <Link to="/login" onClick={() => (clearCookie = true)}>
          Login
        </Link>
      </p>
      {/* <p className="nav_logout"> */}
      <form method="get" action="/">
        <button
          onClick={() => {
            // 원하는 유저 쿠키만 삭제 : currentCookies[index]
            // 모든 쿠키 오브젝트로 받기
            console.log(cookies.getAll());
            // 모든 쿠키 삭제 // 서버에서도 삭제
            currentCookie.forEach((each) => {
              console.log(each);
              // 쿠키 삭제 syntax
              // remove(targetName, {(optional..)})
              cookies.remove(each, { path: "/" });
              // 그리고 서버에 알리기
            });
          }}
        >
          Logout
        </button>
      </form>
    </nav>
  );
}

export default Navbar;
