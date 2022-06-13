import React, { useEffect, useRef } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // 얘는 어디에 쓰일까
    const canvas = canvasRef.current;
  }, []);

  useEffect(() => {
    // canvas, ctx only in this useEffect
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 576;

    // ctx.fillStyle = 'white';
    // ctx.fillRect(0,0, canvas.width, canvas.height);

    const mapImg = new Image();
    mapImg.src = mapImage;

    const keyPressed = {
      w: false,
      a: false,
      s: false,
      d: false,
    };
    // make girl sprite
    const girl = new Characters({
      position: {
        x: 165,
        y: 150,
      },
      image: girlImage,
    });

    const boy = new Characters({
      position: {
        x: 180,
        y: 250,
      },
      image: boyImage,
    });

    const keydownHandler = (e, keyPressed) => {
      girl.move(e, keyPressed);
      boy.move(e, keyPressed);
    };
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", () => {
      girl.stop();
      boy.stop();
    });

    //making animation loop
    const cycleLoop = [0, 1, 2, 3];
    let currentLoopIndex = 0;
    let frameCount = 0;
    let framelimit = 12;

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (girl.isMoving) {
        frameCount++;
        if (frameCount >= framelimit) {
          frameCount = 0;
          currentLoopIndex++;
          if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
          }
        }
      }

      ctx.drawImage(mapImg, 0, 0) &&
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      girl.drawFrame(
        cycleLoop[currentLoopIndex],
        girl.currentDirection,
        girl.positionX,
        girl.positionY,
        ctx
      );
      boy.drawFrame(
        cycleLoop[currentLoopIndex],
        boy.currentDirection,
        boy.positionX,
        boy.positionY,
        ctx
      );

      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);

    // return function : remove
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keydownHandler);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default Canvas;
