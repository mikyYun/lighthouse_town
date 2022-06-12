import React, { useEffect, useRef } from "react";
import mapImage from './game_img/town-map.png'
import girlImage from './game_img/girl1.png'
import Sprite from "./helper/Sprite";

const Canvas = (props) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

  } , [])

  useEffect(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d')
  canvas.width = 1024;
  canvas.height = 576;

  ctx.fillStyle = 'white';
  ctx.fillRect(0,0, canvas.width, canvas.height);

  const mapImg = new Image();
  mapImg.src = mapImage
  const girlImg = new Image();
  girlImg.src = girlImage

  class Sprite {
    constructor({ position, velocity, image
    }) {
      this.positionX = position.x
      this.positionY = position.y
      this.image = image
    }

    draw() {
      ctx.drawImage(this.image ,this.positionX, this.positionY)
    }
  };

  // make new Sprites
  const background = new Sprite({
    position: {
      x: 0,
      y: 0
    },
    image: mapImg
  })

  const keyPressed = {
    w: false,
    a: false,
    s: false,
    d: false
  }

  // keypress for movement
  const movement_speed = 5;
  let positionX = 0;
  let positionY = 0;
  const facing = {
    up: 3,
    down: 0,
    left: 1,
    right: 2
  }
  let currentDirection = facing.down
  let isMoving = false;

  window.addEventListener('keydown', (e) => {
    switch(e.key){
      case "w":
        keyPressed.w = true;
        positionY -= movement_speed;
        currentDirection = facing.up;
        isMoving = true;
        break
      case "a":
        keyPressed.a = true;
        positionX -= movement_speed;
        currentDirection = facing.left;
        isMoving = true;
        break
      case "s":
        keyPressed.s = true;
        positionY += movement_speed;
        currentDirection = facing.down;
        isMoving = true;
        break
      case "d":
        keyPressed.d = true;
        positionX += movement_speed;
        currentDirection = facing.right;
        isMoving = true;
        break
    }
  })

  window.addEventListener('keyup', (e) => {
    switch(e.key){
      case "w":
        keyPressed.w = false
        isMoving = false;
        break
      case "a":
        keyPressed.a = false;
        isMoving = false;
        break
      case "s":
        keyPressed.s = false;
        isMoving = false;
        break
        case "d":
        keyPressed.d = false;
        isMoving = false;
        break
    }
  });

  const width = 63.5;
  const height = 63.5;
  const drawFrame = (frameX, frameY, canvasX, canvasY) => {
    ctx.drawImage(girlImg,
      frameX * width, frameY * height,
      width, height,
      165 + canvasX, 150 + canvasY,
      width, height
    )
  }

  //making animation loop
  const cycleLoop = [0,1,2,3];
  let currentLoopIndex = 0;
  let frameCount = 0;
  let framelimit = 12;

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isMoving) {
      frameCount++;
      if (frameCount >= framelimit) {
        frameCount = 0;
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
          currentLoopIndex = 0;
        }
      }
    }

    background.draw() && ctx.clearRect(0,0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex],currentDirection,positionX,positionY);

    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);




}, [])



  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default Canvas;