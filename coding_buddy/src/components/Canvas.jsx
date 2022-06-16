import React, { useEffect, useRef, useState, useContext } from "react";
import mapImage from "./game_img/town-map.png";
// import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
// import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import selectAvatar from "./helper/selecAvatar";
import  { SocketContext } from '../App'


const Canvas = (props) => {
  const { socket } = useContext(SocketContext)
  const canvasRef = useRef(null);
  const [usersPosition, setUsersPosition] = useState();
  const [userCharacters, setUserCharacters] = useState([]);

  // create user's character
  const username = props.username; //moon
  const avatar = props.avatar;  //1
  const userData = {
    username: props.username,
    x: 150,
    y: 150,
  }
  const userChar = new Characters(userData)



  // get other users data from the server
  socket.on('sendData', data => {
    console.log('data', data)
    delete data[username]
    setUsersPosition(data)
    console.log('data', data)
  })

  console.log('usersPosition', usersPosition) //가장 처음에는 undefined 여야함.


  const isEmpty = (state) => {
    return !state || Object.keys(state).length === 0 ? true : false
  }
  const createCharacterHandler = (name, char) => {
    setUserCharacters(prev => ({...prev, [name]: char}))
  }

  const createCharacter = () => {
    console.log('isEmpty?', isEmpty(usersPosition));
    if (!isEmpty(usersPosition)) {
      console.log("users are here!!!!!")
      console.log(usersPosition)
      console.log(userCharacters)
      // when there is no characters
      console.log(isEmpty(userCharacters))
      if(isEmpty(userCharacters)) {
        console.log('no character here!!!!', usersPosition)
        // console.log(usersPosition[Object.keys(usersPosition)])
        console.log('object keys', Object.keys(usersPosition))
        Object.keys(usersPosition).map( (username, i) => {
          let char = new Characters(usersPosition[Object.keys(usersPosition)[i]]);
          createCharacterHandler(username, char)  //////////////how can I store name as name variable that I define above???
          // console.log('create!!!!!', userCharacters)
        })
        // console.log('char', char)
    }
  }
    console.log('inside create char', userCharacters)
}
createCharacter()

  // useEffect(() => {
  //   for (let name in usersPosition) {
  //     console.log(name) // moon, heesoo, mike
  //     // 만약에 이름이 나랑 같지 않고
  //     if (name !== userData.username) {
  //       console.log('first', userCharacters)
  //       if (userCharacters.length === 0) {
  //         console.log('second', userCharacters)
  //         let char = new Characters(usersPosition[name])
  //         setUserCharacters(prev => [...prev, char])
  //         console.log('third', userCharacters)
  //         // otherUserChars.push(char);
  //       } else {
  //         // once updated, draw the canvas!
  //         console.log('inside else')
  //         userCharacters.forEach(char => {
  //           if (char.state.username !== name) {
  //             let char = new Characters(usersPosition[name])
  //             console.log('new Char', char)
  //             setUserCharacters(prev => [...prev, char])
  //             console.log('userChar state', userCharacters)
  //           }
  //         })
  //       }
  //     }
  //   }

  //   // console.log('otheruserchars',otherUserChars[0])
  // }, [usersPosition])


  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  const sendData = props.sendData
  // console.log("THIS", sendMessage)
  // console.log("THAT", sendPrivateMessage)
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

      ctx.clearRect(0, 0, canvas.width, canvas.height)

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

      ctx.fillText(username, userChar.state.x + 20, userChar.state.y + 10)
      ctx.fillStyle = 'purple'

      // console.log('inside step', userCharacters);
      if (userCharacters.length > 0) {
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
    window.requestAnimationFrame(step);

    window.addEventListener("keydown", e => {
      userChar.move(e)
      socket.emit('sendData', userChar.state)
      // console.log('sendData', userChar.state)
      // sendMessage("SEND")
    });
    window.addEventListener("keyup", () => {
      userChar.stop()
      socket.emit('sendData', userChar.state)
      // sendPrivateMessage("moon", "this is private message", username)
    });
    // add another



    // pass function
    // window.requestAnimationFrame(() => gameLoop(ctx, canvas, characters, mapImg));

    //   setInterval(() => {
    //   socket.on('init', msg => console.log('msg', msg))
    //   socket.emit('sendData', userChar.state)
    sendData(userChar.state) // socket.emit("sendData", userChar.state)
    //   socket.on('backData', data => console.log('data', data))
    // } ,1000)


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