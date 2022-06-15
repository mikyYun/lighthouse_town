import React, { useEffect, useRef } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";
import randomGenerator from "./helper/randomGenerator";

const { io } = require("socket.io-client");
const socket = io('http://localhost:3000')

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {

    // put step function
    // canvas, ctx only in this useEffect
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    // ctx.fillStyle = 'white';
    // ctx.fillRect(0,0, canvas.width, canvas.height);

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



    // const characters = {
    //   girl: new Characters({
    //     id: randomGenerator(),
    //     position: {
    //       x: 165,
    //       y: 150,
    //     },
    //     image: girlImage,
    //   }),
      // boy: new Characters({
      //   position: {
      //     x: 180,
      //     y: 250,
      //   },
      //   image: boyImage,
      // })
     // test data for sockets

    // dynamically create characters
    // websockets girl -> websockets
    // person joins server will have list of characters
    // if websocket user -> make a character -> character obj

    // chat bubble :
    //

  // from database
  const username = 'heesoo'
  const users = [
    {
      username: 'heesoo',
      x: 165,
      y: 50,
      currentDirection: 0,
      isMoving: false,
      image: girlImage
    },
    {
      username: 'john',
      x: 200,
      y: 100,
      currentDirection: 0,
      isMoving: false,
      image: boyImage
    },
    {
      username: 'hero',
      x: 300,
      y: 150,
      currentDirection: 0,
      isMoving: false,
      image: boyImage
    }
  ]

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
       console.log('heesoo', userChar)
       console.log("new", characters)
      }
    )}
    makeCharacters(users, 'heesoo')

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        characters.map(character => {
          character.drawFrame(ctx)
        });

        userChar.drawFrame(ctx);

      window.requestAnimationFrame(step);
    };
    // console.log(Char)
    window.addEventListener("keydown", e => userChar.move(e));
    window.addEventListener("keyup", () => userChar.stop());

    window.requestAnimationFrame(step);

    // pass function
    // window.requestAnimationFrame(() => gameLoop(ctx, canvas, characters, mapImg));

    // socket.on('init', msg => console.log(msg))
    // socket.emit('sendData', Char.state)
    // socket.on('backData', data => console.log(data))


    return () => {
      window.removeEventListener("keydown", e => userChar.move(e));
      window.removeEventListener("keyup", () => userChar.stop());
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};


export default Canvas;
