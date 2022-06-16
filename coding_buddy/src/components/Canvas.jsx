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

  const username = props.username; //moon
  const avatar = props.avatar;  //1
  const userData = {
    username: props.username,
    x: 150,
    y:150,
  }
  const userChar = new Characters(userData)
  console.log('userChar', userChar)

  let otherUsers;
  let otherUserChars = [];
  // get other users data from the server
  setInterval(() => {
    socket.on('sendData', data => {
      console.log('data', data);
      otherUsers = data;

      //create character and do manipulation
      // if (otherUsers) {
      //   console.log('before for-loop')
      //   for (const [key, value] of Object.entries(otherUsers)) {
      //     console.log(`${key}: ${value}`);
      //   }
      // }

      for ( let name in otherUsers) {
        // exclude my own character
        if (name !== userData.username && name !== otherUsers[name]) {  // name :park
            let char = new Characters(otherUsers[name])
            otherUserChars.push(char);
          }
      }
      console.log('otherUserChars', otherUserChars)


    })
  } ,3000)
  console.log('otherUsers', otherUsers)

  // console.log('props', props)
  // console.log('inside canvas avatar', avatar)
  // console.log('inside canvas username', username)

  //make user Character


  // other users Character

  // otherUsers = {
  //   Park: {username: 'Park', x: 150, y: 190,currentDirection: 0, isMoving: false},
  //   moon: {username: 'moon', x: 150, y: 140, currentDirection: 3, isMoving: false}
  // }

//   otherUsers = {
//     "Park": {
//         "username": "Park",
//         "x": 270,
//         "y": 400,
//         "currentDirection": 2,
//         "isMoving": false
//     },
//     "moon": {
//         "username": "moon",
//         "x": 160,
//         "y": 180,
//         "currentDirection": 0,
//         "isMoving": false
//     }
// }

  // console.log('otherUsers', otherUsers)



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
  // console.log('props', props)
  // const username = props.username; //moon
  // const avatar = props.avatar;  //1
  // console.log('inside canvas avatar', avatar)
  // console.log('inside canvas username', username)

  // //make user Character
  // const userData = {
  //   username: props.username,
  //   x: 150,
  //   y:150,
  // }


  // image: selectAvatar(props.avatar),
  // const userChar = new Characters(userData)
  // console.log('userChar', userChar)
  // // other users Character
  // let otherUserChars = [];
  // for ( let name in otherUsers) {
  //   if (name !== userData.username) {
  //     otherUserChars.push(otherUsers[name])
  //   }
  // }
  console.log('otherUser', otherUsers )
    //making animation loop

    let frameCount = 0;
    let framelimit = 10;


    // // make it as array
    // const makeCharacters = (users, name) => {
    //   users.map(user => {
    //     if (user.username === name) {
    //       userChar = new Characters(user)
    //     } else {
    //      characters.push(new Characters(user))
    //     }
    //    console.log('userChar', userChar)
    //    console.log("new", characters)
    //   }
    // )}
    // makeCharacters(users, username)


  function step() {
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

        // draw other user characters
        otherUserChars.map(otherUserChar => {
          otherUserChar.drawFrame(ctx)
          ctx.fillText(otherUserChar.state.username, otherUserChar.state.x + 20, otherUserChar.state.y+10)
          ctx.fillStyle = 'purple'
        });



      window.requestAnimationFrame(step);
    }
    // console.log(Char)
    window.addEventListener("keydown", e => {
      // console.log('otherUsers', otherUsers)
      // console.log('otherUsersChar', otherUserChars)

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
