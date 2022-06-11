import React, { useEffect, useRef } from "react";
import mapImage from './game_img/town-map.png'
import girlImage from './game_img/girl1.png'

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

  const map = new Image();
  map.src = mapImage
  const girl = new Image();
  girl.src = girlImage

  map.onload = () => {
    ctx.drawImage(map ,0,0)
    ctx.drawImage(girl,
      0,0,
      62,62,
      165, 150,
      62,62
      )
    }


}, [])

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default Canvas;