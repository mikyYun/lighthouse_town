import React from "react";
import Canvas from "./Canvas";
import "./Game.scss";
import Navbar from "./Navbar";
import Layout from "./Layout";


export default function Game() {

  // pass the mapimg as props

  return(
    <>
      <Layout />
      <Canvas />
    </>
  );
}
