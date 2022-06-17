import React, { useEffect, useState, useRef } from "react";
import { Stage, Image, Rect, Layer } from "react-konva";
import boy from './game_img/boy1.png'

export default function Characters() {

  const [image, setImage] = useState(new window.Image());

  useEffect(() => {
    // const animations  = {
    //   idle: [
    //     0, 0, 63.5, 63.5,
    //     63.5, 0, 63.5, 63.5,
    //     127, 0, 63.5, 63.5,
    //     190.5, 0, 63.5, 63.5
    //   ]
    // }
    const img = new window.Image();
    img.src = boy;
    setImage(img);
    // img.onload = () => {
    //   const boy = new Konva.Sprite({
    //     x: 50,
    //     y: 50,
    //     image: img,
    //     animation: 'idle',
    //     animation: animations,
    //     frameRate: 7,
    //     frameIndex: 0
    //   });

    // }



  }, [])

  return(
    <Image x={0} y={0} width={63.5} height={63.5} image={image}/>
    // <Image x={0} y={0}/>
  )
}


