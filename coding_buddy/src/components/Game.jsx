import React from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Navbar from "./Navbar";
import Layout from "./Layout";


export default function Game() {
  console.log("game loading")
  // pass the mapimg as props

  return(
    <>
      <Layout />
      <Canvas />
    </>
  );
}
