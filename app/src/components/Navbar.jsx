/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
// import Cookies from "universal-cookie";
const logo = require("../img/lighthouse.png");

let clearCookie = false;
function Navbar(props) {
  // const [history, setHistory] = useState();
  // const cookies = new Cookies();
  // const currentCookie = Object.keys(cookies.getAll());

  return (
    <nav className="navigation">
      <Link to="/" >
        <img className="logo_img" src={logo} alt="Lighthouse"></img>
      </Link>
      <a href="random"></a>
      <p className="nav_home">
        <Link to="/" >
          Home
        </Link>
      </p>
      <p className="nav_game">
        <Link to="/game">Game</Link>
      </p>
      <p className="nav_chat">
        <Link to="/chat">Chat</Link>
      </p>
      {/* {true ? "test" : "no"} */}
      <p className="nav_register">
        <Link to="/register" >
          Register
        </Link>
      </p>
      <p className="nav_login">
        <Link to="/login" >
          Login
        </Link>
      </p>
      {/* <p className="nav_logout"> */}
      <form method="get" action="/">
        <button
        // 
        >
          Logout
        </button>
      </form>
    </nav>
  );
}

export default Navbar;
