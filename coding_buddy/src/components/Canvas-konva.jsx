import React, { useEffect, useState, useRef } from "react";
import { ReactDOM } from "react-dom";
import { Stage, Image, Layer, Sprite, Group } from "react-konva";
import townMap from './game_img/town-map.png'
import boyImg from './game_img/boy1.png'

export default function Canvas () {

  const [image, setImage] = useState([new window.Image()]);
  const [imgOptions, setImgOptions] = useState({
    boy: null
  })


  const spriteRef = useRef;
  useEffect(() => {
    const img = new window.Image();
    img.src = townMap;
    setImage(img);

    const boy = new window.Image();
    boy.src = boyImg;
  },[])

  // useEffect(() => {

  //   const boy = new window.Image();
  //   boy.src = boyImg;
  //   boy.onload = () => {
  //     setImgOptions({
  //       boy: boy
  //     });

  //     spriteRef.current.start();
  //   };
  // });

  //   const animations  = {
  //     idle: [
  //       0, 0, 63.5, 63.5,
  //       63.5, 0, 63.5, 63.5,
  //       127, 0, 63.5, 63.5,
  //       190.5, 0, 63.5, 63.5
  //     ]
  //   };

  return (
    <div>
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Group>
          <Image x={0} y={0} image={image[0]} />
        </Group>
      </Layer>
    </Stage>
    </div>
  )
}