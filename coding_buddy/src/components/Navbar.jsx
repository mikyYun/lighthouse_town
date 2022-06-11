import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";
const logo = require("../img/lighthouse.png");

function Navbar() {
  const cookies = new Cookies();
  const currentCookie = Object.keys(cookies.getAll());
  // if (window !== undefined) {
    window.addEventListener("unload", () => {
      currentCookie.forEach(each => {
        cookies.remove(each, {path: "/"})
      })
    })
  // }
  // 쿠키 삭제 테스트
  // 키 업 => 쿠키 삭제
  // document.addEventListener("keyup", () => {
  //   cookies.remove("test", {path: '/'})
  // });
  return (
    <nav>
      <div className="nav_logo">
        <Link to="/">
          <img className="logo_img" src={logo} alt="Lighthouse"></img>
        </Link>
      </div>
      <div>
        <p className="nav_home">
          <Link to="/">Home</Link>
        </p>
        <p className="nav_sockets">
          <Link to="/sockets">Sockets</Link>
        </p>
        <p className="nav_game">
          <Link to="/game">Game</Link>
        </p>
        <p className="nav_register">
          <Link to="/register">Register</Link>
        </p>
        <p className="nav_login">
          <Link to="/login">Login</Link>
        </p>
        <p className="nav_logout">
          <form method="get" action="/">
            <button onClick={() => {
              // 원하는 유저 쿠키만 삭제 : currentCookies[index]
              // 모든 쿠키 오브젝트로 받기
              console.log(cookies.getAll());
              // 모든 쿠키 삭제 // 서버에서도 삭제
              currentCookie.forEach(each => {
                console.log(each)
                // 쿠키 삭제 syntax
                // remove(targetName, {(optional..)})
                cookies.remove(each, {path: "/"})
                // 그리고 서버에 알리기
              })
            }}>
              Logout
            </button>
          </form>
        </p>
      </div>
    </nav>
  );
}

export default Navbar;
