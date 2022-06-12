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

  window.addEventListener('keydown', (e) => {
    switch(e.key){
      case "w":
        keyPressed.w = true;
        positionY -= movement_speed;
        break
      case "a":
        keyPressed.a = true;
        positionX -= movement_speed;
      break
      case "s":
        keyPressed.s = true;
        positionY += movement_speed;
        break
      case "d":
        keyPressed.d = true;
        positionX += movement_speed;
        break
    }
  })

  window.addEventListener('keydown', (e) => {
    switch(e.key){
      case "w": keyPressed.w = false; break
      case "a": keyPressed.a = false; break
      case "s": keyPressed.s = false; break
      case "d": keyPressed.d = false; break
    }
  });

  const width = 62;
  const height = 62;
  const drawFrame = (frameX, frameY, canvasX, canvasY) => {
    ctx.drawImage(girlImg,
      frameX * width, frameY * height,
      width, height,
      165 + canvasX, 150 + canvasY,
      width, height
    )
  }
  // walk frames
  // remove the first frame and draw second frame

  // drawFrame(0,0,0,0);
  // drawFrame(1,0,1,0);
  // drawFrame(2,0,2,0);
  // drawFrame(3,0,3,0);

  //making animation loop
  const cycleLoop = [0,1,2,3];
  let currentLoopIndex = 0;
  let frameCount = 0;


  function step() {

    frameCount++;
    if (frameCount < 15) {
      window.requestAnimationFrame(step);
      return;
    }

    frameCount = 0;
    background.draw() && ctx.clearRect(0,0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex],0,positionX,positionY);
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop.length) {
      currentLoopIndex = 0;
    }
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);

// mapImg.onload = () => {
//   background.draw();
//   step()
// }




}, [])



  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default Canvas;