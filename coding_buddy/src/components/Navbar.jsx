import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Cookies from "universal-cookie";
const logo = require("../img/lighthouse.png");

let clearCookie = false;
function Navbar(props) {
  console.log("nav", props)
  // const [history, setHistory] = useState();
  const cookies = new Cookies();
  const removeAllCookies = props.click
  const currentCookie = Object.keys(cookies.getAll());

  return (
    <nav className="navigation">
      <Link to="/" onClick={() => removeAllCookies()}>
        <img className="logo_img" src={logo} alt="Lighthouse"></img>
      </Link>
      <a href="djsaf.facebook.sdfkajle"></a>
      <p className="nav_home">
        <Link to="/" onClick={() => removeAllCookies()}>
          Home
        </Link>
      </p>
      <p className="nav_game">
        <Link to="/game">Game</Link>
      </p>
      {/* {true ? "test" : "no"} */}
      <p className="nav_register">
        <Link to="/register" onClick={() => removeAllCookies()}>
          Register
        </Link>
      </p>
      <p className="nav_login">
        <Link to="/login" onClick={() => removeAllCookies()}>
          Login
        </Link>
      </p>
      {/* <p className="nav_logout"> */}
      <form method="get" action="/">
        <button
          // onClick={() => removeAllCookies()}
        >
          Logout
        </button>
      </form>
    </nav>
  );
}

export default Navbar;
