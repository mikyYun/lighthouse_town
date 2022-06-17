// 1. make background
// 2. create character div
// 3. key press set the data

import React, { useEffect, useRef, useState, useContext } from "react";
import './Canvas3.scss'
import Characters from "./Characters";

export default function Canvas(props) {
  const [user, setUser] = useState({
    [props.username] : {
      name:'moon',
      x: 20,
      y: 30,
      direction: 'down',
      avatar: props.avatar
    }})
// mock data
const data = {
  'mike': {
    name: 'mike',
    x: 10,
    y: 10,
    direction: 'down',
    avatar: 2

  }
}
    useEffect(() => {
      console.log(user)
      console.log(props.username)
      const position = data.mike
      setUser(prev => ({...prev, mike : position}))

    }, [])
    console.log(user)

    const handleMove = (e) => {
      const move = {
        "ArrowUp" : (0, -1),
        "ArrowDown" : (0, 1),
        "ArrowLeft" : (-1, 0),
        "ArrowUp" : (0, 1)
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', e => {
        console.log()

      })
    })


  // React.createElement(
  //   "div",
  //   {className: "users"},
  // )
  let playerId = props.username;
  // let playerRef = React.createRef();

  // will be come from the data
  let players = {};
  let playerElements = {};

  const elm = [];
  for (const u in user) {
    elm.push(<div className="users"></div>)
  }


  return (
    <div className="game-container">
      {elm}
    </div>
  )
};