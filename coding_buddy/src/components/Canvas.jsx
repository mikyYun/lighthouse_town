import React, { useEffect, useRef } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";

const { io } = require("socket.io-client");
const socket = io('http://localhost:3000')



const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    socket.on('init', msg => console.log(msg))


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

    const girlSprite = new Characters({
      position: {
        x: 165,
        y: 150,
      },
      image: girlImage,
    })
    // girlsprite to websockets server - front -> back
    // girlSprite should have id
    // eventListener for only that id

    // websockets shoule have an array of users - back
    // broadcast the list of the array of users - back -> front
    // websockets on react render that list of users  - front

    // make girl sprite
    const characters = {
      girl: new Characters({
        position: {
          x: 165,
          y: 150,
        },
        image: girlImage,
      }),
      // boy: new Characters({
      //   position: {
      //     x: 180,
      //     y: 250,
      //   },
      //   image: boyImage,
      // })
    }

    // dynamically create characters
    // websockets girl -> websockets
    // person joins server will have list of characters
    // if websocket user -> make a character -> character obj
;
    window.addEventListener("keydown", e => characters.girl.move(e));
    window.addEventListener("keyup", () => characters.girl.stop());

    //making animation loop
    const cycleLoop = [0, 1, 2, 3];
    let currentLoopIndex = 0;
    let frameCount = 0;
    let framelimit = 10;

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // walking effect
      if (characters.girl.state.isMoving) {
        frameCount++;
        if (frameCount >= framelimit) {
          frameCount = 0;
          currentLoopIndex++;
          if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
          }
        }
      }

      ctx.drawImage(mapImg, 0, 0)

      characters.girl.drawFrame(
        cycleLoop[currentLoopIndex],
        characters.girl.state.currentDirection,
        characters.girl.state.x,
        characters.girl.state.y,
        ctx
      );

      window.requestAnimationFrame(step);
    };
    // console.log(characters.girl)
    window.requestAnimationFrame(step);

    // pass function
    // window.requestAnimationFrame(() => gameLoop(ctx, canvas, characters, mapImg));

    // return function : remove
    return () => {
      window.removeEventListener("keydown", e => characters.girl.move(e));
      window.removeEventListener("keyup", () => characters.girl.stop());
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default Canvas;
