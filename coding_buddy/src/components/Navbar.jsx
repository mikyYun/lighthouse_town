import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
   <nav>
     <ul>
       <li>
         <Link to="/">Home</Link>
       </li>
       <li>
         <Link to="/sockets">Sockets</Link>
       </li>
       <li>
         <Link to="/game">Game</Link>
       </li>
     </ul>
   </nav>
  )
}

export default Navbar;