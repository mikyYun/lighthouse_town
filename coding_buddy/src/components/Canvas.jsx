import React, { useEffect, useRef } from "react";
import mapImage from "./game_img/town-map.png";
// import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
// import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import selectAvatar from "./helper/selecAvatar";


const { io } = require("socket.io-client");
const socket = io('http://localhost:3000')

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  console.log("THIS", sendMessage)
  console.log("THAT", sendPrivateMessage)
  useEffect(() => {
    //make collision wall
    // console.log(townWall.length)
    const collisionTownMap = []
    for (let i = 0; i < townWall.length; i += 70) {
      collisionTownMap.push(townWall.splice(i, i + 70))
    }

    // console.log(collisionTownMap)

    // put step function
    // canvas, ctx only in this useEffect
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1120;
    canvas.height = 640;

    const mapImg = new Image();
    mapImg.src = mapImage;

    // girlsprite to websockets server - front -> back
    // girlSprite should have id
    // eventListener for only that id

    // websockets shoule have an array of users - back
    // broadcast the list of the array of users - back -> front
    // websockets on react render that list of users  - front

    // make girl sprite
    // use userid from database
    // x, y

    // dynamically create characters
    // websockets girl -> websockets
    // person joins server will have list of characters
    // if websocket user -> make a character -> character obj

    // chat bubble :
    //

    // test data from database
    console.log('props', props)
    const username = props.username;
    const avatar = props.avatar;
    console.log('inside canvas avatar', avatar)
    console.log('inside canvas username', username)

    const users = []
    users.push({
      username: props.username,
      x: 150,
      y: 150,
      image: selectAvatar(props.avatar)
    })
    console.log('users', users)
    // const users = [
    //   {
    //     username: 'moon',
    //     x: 165,
    //     y: 50,
    //     currentDirection: 0,
    //     isMoving: false,
    //     image: girlImage
    //   },
    //   {
    //     username: 'heesoo',
    //     x: 200,
    //     y: 100,
    //     currentDirection: 0,
    //     isMoving: false,
    //     image: boyImage
    //   },
    //   {
    //     username: 'Park',
    //     x: 300,
    //     y: 150,
    //     currentDirection: 0,
    //     isMoving: false,
    //     image: boyImage
    //   }
    // ]

    let userChar;

    //making animation loop

    let frameCount = 0;
    let framelimit = 10;

    // make it as array
    let characters = [];
    const makeCharacters = (users, name) => {
      users.map(user => {
        if (user.username === name) {
          userChar = new Characters(user)
        } else {
          characters.push(new Characters(user))
        }
        console.log('userChar', userChar)
        console.log("new", characters)
      }
      )
    }
    makeCharacters(users, username)


    function step() {

      // go through users array and make each chracters

      // walking motion
      if (userChar.state.isMoving) {
        frameCount++;
        if (frameCount >= framelimit) {
          frameCount = 0;
          userChar.incrementLoopIndex();
        }
      }

      ctx.drawImage(mapImg, 0, 0)

      // characters.map(character => {
      //   character.drawFrame(ctx)
      //   ctx.fillText(character.state.username, character.state.x + 20, character.state.y+10)
      //   ctx.fillStyle = 'purple'
      // });

      userChar.drawFrame(ctx);
      ctx.fillText(username, userChar.state.x + 20, userChar.state.y + 10)
      ctx.fillStyle = 'purple'

      window.requestAnimationFrame(step);
    }
    // console.log(Char)
    window.addEventListener("keydown", e => {
      userChar.move(e)
      sendMessage("SEND")
    });
    window.addEventListener("keyup", () => {
      userChar.stop()
      sendPrivateMessage("moon", "this is private message", username)
    });

    window.requestAnimationFrame(step);

    // pass function
    // window.requestAnimationFrame(() => gameLoop(ctx, canvas, characters, mapImg));

    //   setInterval(() => {
    //   socket.on('init', msg => console.log('msg', msg))
    //   socket.emit('sendData', userChar.state)
    //   socket.on('backData', data => console.log('data', data))
    // } ,1000)


    return () => {
      window.removeEventListener("keydown", e => userChar.move(e));
      window.removeEventListener("keyup", () => userChar.stop());
    };
  }, []);

  return (
    <div className="game-container">
      <canvas className="game-canvas" ref={canvasRef}></canvas>
    </div>
  );
};


export default Canvas;
