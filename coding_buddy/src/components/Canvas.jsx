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
  const [ctx, setCtx] = useState();
  const [canvas, setCanvas] = useState();

  // create user's character
  const username = props.username; //moon
  const avatar = props.avatar;  //1
  const userData = {
    username: props.username,
    x: 150,
    y: 150,
  }
  const userChar = new Characters(userData)


  console.log('usersPosition', usersPosition) //가장 처음에는 undefined 여야함.


  const isEmpty = (state) => {
    return !state || Object.keys(state).length === 0 ? true : false
  }
  const characterHandler = (name, char) => {
    console.log('char:', char);
    setUserCharacters(prev => {
      const updatedChar = {
        ...prev,
        [name]: prev[name].state
      };
      updatedChar[name].state = char;
      return updatedChar;
    });
  }

  const createCharacter = () => {
    // console.log('isEmpty?', isEmpty(usersPosition));
    if (!isEmpty(usersPosition)) {
      // console.log("users are here!!!!!")
      // console.log(usersPosition)
      // console.log(userCharacters)
      // when there is no characters
      // console.log(isEmpty(userCharacters))
      if(isEmpty(userCharacters)) {
        // console.log('no character here!!!!', usersPosition)
        // console.log(usersPosition[Object.keys(usersPosition)])
        // console.log('object keys', Object.keys(usersPosition))
        Object.keys(usersPosition).map( (username, i) => {
          let char = new Characters(usersPosition[Object.keys(usersPosition)[i]]);
          characterHandler(username, char)  //////////////how can I store name as name variable that I define above???
          // console.log('create!!!!!', userCharacters)
        })
        // console.log('char', char)
     }
   }
    // console.log('inside create char', userCharacters)
  }
  // createCharacter()

  // const CharacterHandler = (name, char) => {
  //   setUserCharacters(prev => ({...prev, [name]: char}))
  // };

  // update user
  // should check if that character already exsit
// const updateState = (user) => {
//   setUserCharacters(prev => (...prev,   ))
// }

const updateCharacter = () => {
  // check if useCharacters exist
  console.log('userCharacters', userCharacters)
  if (isEmpty(userCharacters)) {
    console.log('its empty')
    return
  }
  console.log('no its not')
  if (usersPosition && userCharacters) {
    console.log(Object.keys(usersPosition))
    Object.keys(usersPosition).forEach( user => {
      console.log('user', user) //moon
      console.log(userCharacters[user])   ///this will be used after fixing it
      console.log(usersPosition[user])
      characterHandler(user, usersPosition[user])
      console.log('afterupdate', userCharacters)
    })
  }
}

// get other users data from the server
socket.on('sendData', data => {
  console.log('data', data)
  delete data[username]
  setUsersPosition(data)
  console.log('data', data)
  createCharacter()
  updateCharacter()
})

useEffect(() => {
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

  return () => {
    window.removeEventListener("keydown", e => userChar.move(e));
    window.removeEventListener("keyup", () => userChar.stop());
  };
} ,[])

  const sendMessage = props.sendMessage
  const sendPrivateMessage = props.sendPrivateMessage
  const sendData = props.sendData
  // console.log("THIS", sendMessage)
  // console.log("THAT", sendPrivateMessage)
  useEffect(() => {
    // put step function
    // canvas, ctx only in this useEffect
    const canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    // setCanvas(canvas);
    const ctx = canvas.getContext("2d");
    // setCtx(ctx)

    // make background image
    const mapImg = new Image();
    mapImg.src = mapImage;

    let frameCount = 0;
    let framelimit = 4;
    function step() {
      if (ctx && canvas) {
        // console.log('Beginning of step:', canvas, ctx);
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
        // login user's character
        userChar.drawFrame(ctx);

        // draw user character

        ctx.fillText(username, userChar.state.x + 20, userChar.state.y + 10)
        ctx.fillStyle = 'purple'
        // console.log('inside step', userCharacters)
        // console.log('inside step', userCharacters);
        // console.log('USERCHARS', userCharacters);
        // console.log('USERSPOS', usersPosition);
        if (!isEmpty(userCharacters)) {
          console.log('otheruser',userCharacters[0])
          userCharacters[0].drawFrame(ctx)
        }
        // otherUserChars.forEach(otherUserChar => {
        //   otherUserChar.drawFrame(ctx)
        //   ctx.fillText(otherUserChar.state.username, otherUserChar.state.x + 20, otherUserChar.state.y+10)
        //   ctx.fillStyle = 'purple'
        // });
      }
      window.requestAnimationFrame(step);
    }

    // console.log(Char)
    window.requestAnimationFrame(step);
  }, []);

  return (
    <div className="game-container">
      <canvas className="game-canvas" ref={canvasRef}></canvas>
    </div>
  );
};


export default Canvas;