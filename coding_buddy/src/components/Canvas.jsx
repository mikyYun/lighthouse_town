import React, { useEffect, useRef, useState } from "react";
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
  const [usersPosition, setUsersPosition] = useState();
  const [userCharacters, setUserCharacters] = useState({});

  const username = props.username; //moon
  const avatar = props.avatar;  //1
  const userData = {
    username: props.username,
    x: 150,
    y:150,
  }
  const userChar = new Characters(userData)
  console.log('userChar', userChar)

  socket.on('sendData', data => {
    setUsersPosition(data)
  });

  // let otherUserChars = [];
  // get other users data from the server
  // setInterval(() => {
  //   socket.on('sendData', data => {
  //     console.log('data', data);
  //     setUsersPosition(data);
  //   })
  // } ,1000)

  console.log('allUsers', usersPosition)


  // remove nested loop
  // make

  // *******
  // set characters -> new Character(150, 150) if it doesn't exist
  // nCharacter.state = {}

//   // create new character for other users
//   {
//     "moon": {
//         "username": "moon",
//         "x": 150,
//         "y": 360,
//         "currentDirection": 0,
//         "isMoving": false
//     },
//     "heesoo": {
//         "username": "heesoo",
//         "x": 150,
//         "y": 200,
//         "currentDirection": 0,
//         "isMoving": false
//     }
// }
if (usersPosition) {
  console.log(Object.keys(usersPosition))
}

  for (let name in usersPosition) {
    console.log('name',name)
    if (name !== username) {
      console.log('not user', name)
      let Char = new Characters(usersPosition[name])
      console.log('Char',Char);
      setUserCharacters({name: Char})

      // setUserCharacters((prev) => {...prev, name: Char});
      console.log('userCharacters',userCharacters)
    }
  }


  // useEffect(() => {
  //   // for ( let name in usersPosition) {
  //   //   console.log(name) // moon, heesoo, mike
  //   //   // 만약에 이름이 나랑 같지 않고
  //   //   if (name !== userData.username) {
  //   //     console.log('first', userCharacters)
  //   //     if (userCharacters.length === 0) {
  //   //       console.log('second', userCharacters)
  //   //       let char = new Characters(usersPosition[name])
  //   //       setUserCharacters( prev => [...prev, char])
  //   //       console.log('third', userCharacters)
  //   //       // otherUserChars.push(char);
  //   //     } else {
  //   //       // once updated, draw the canvas!
  //   //       console.log('inside else')
  //   //       userCharacters.forEach(char => {
  //   //         if (char.state.username !== name) {
  //   //           let char = new Characters(usersPosition[name])
  //   //           console.log('new Char', char)
  //   //           setUserCharacters( prev => [...prev, char])
  //   //           console.log('userChar state', userCharacters)
  //   //         }
  //   //       })
  //   //     }
  //   //   }
  // // }

  //   // console.log('otheruserchars',otherUserChars[0])
  // }, [usersPosition])


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

    // make background image
    const mapImg = new Image();
    mapImg.src = mapImage;


    let frameCount = 0;
    let framelimit = 10;

  function step() {

    // socket.on('sendData', data => {
    //   // console.log('data', data);
    //   setUsersPosition(data);
    // })
     // go through users array and make each chracters

     ctx.clearRect(0,0, canvas.width, canvas.height)

        // walking motion
         if (userChar.state.isMoving) {
          frameCount++;
          if (frameCount >= framelimit) {
            frameCount = 0;
            userChar.incrementLoopIndex();
          }
        }

        // draw background map
        ctx.drawImage(mapImg, 0, 0)
        userChar.drawFrame(ctx);

        // draw user character

        ctx.fillText(username, userChar.state.x + 20, userChar.state.y+10)
        ctx.fillStyle = 'purple'

        // console.log('inside step', userCharacters);
        if (userCharacters.length >0) {
          userCharacters[0].drawFrame(ctx)
        }

        // otherUserChars.forEach(otherUserChar => {
        //   otherUserChar.drawFrame(ctx)
        //   ctx.fillText(otherUserChar.state.username, otherUserChar.state.x + 20, otherUserChar.state.y+10)
        //   ctx.fillStyle = 'purple'
        // });

      window.requestAnimationFrame(step);
    }

    // console.log(Char)
    window.addEventListener("keydown", e => {
      console.log(e.key)
      userChar.move(e)
      socket.emit('sendData', userChar.state)
    });
    window.addEventListener("keyup", () => {
      userChar.stop()
      socket.emit('sendData', userChar.state)
    });
    // add another

    window.requestAnimationFrame(step);

    // pass function
    // window.requestAnimationFrame(() => gameLoop(ctx, canvas, characters, mapImg));



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
