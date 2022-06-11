import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
const logo = require('../img/lighthouse.png')
function Navbar() {
  return (
    <nav>
      <div className="nav_logo">
          <Link to="/">
        <img className="logo_img" src={logo} alt="Lighthouse">
        </img>
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
      </div>
    </nav>
  );
}

export default Navbar;
