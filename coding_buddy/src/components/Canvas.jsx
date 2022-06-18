import React, { useEffect, useRef, useState, useContext } from "react";
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import selectAvatar from "./helper/selecAvatar";
import { SocketContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";

const Canvas = (props) => {
    const { socket } = useContext(SocketContext)
    const canvasRef = useRef(null);
    const [userCharacters, setUserCharacters] = useState({
        [props.username]: new Characters({
            username: props.username,
            x: 150,
            y: 150,
            currentDirection: 0,
            frameCount:0,
            avatar: 1
        }
    )});

    const navigate = useNavigate();
    const location = useLocation();
    const roomLists = {
      html: "/game/html",
      css: "/game/css",
      javascript: "/game/js",
      react: "/game/react",
      ruby: "/game/ruby",
    };

    useEffect(() => {

        socket.on('connect', () => {
            const canvas = canvasRef.current;
            canvas.width = 1120;
            canvas.height = 640;
            const ctx = canvas.getContext("2d");

            const mapImg = new Image();
            mapImg.src = mapImage;
            ctx.drawImage(mapImg, 0, 0);

            for(const userChar in userCharacters) {

                // console.log(userChar)
                // console.log(userCharacters)
                userCharacters[userChar].drawFrame(ctx);

                // Text on head.
                ctx.fillText(userCharacters[userChar].state.username, userCharacters[userChar].state.x + 20, userCharacters[userChar].state.y + 10)
                ctx.fillStyle = 'purple';
            }

            socket.emit('sendData', userCharacters[props.username].state)
        })

        socket.on('sendData', data => {
            console.log('data', data);
            const newCharactersData = data;
            newCharactersData[props.username] = userCharacters[props.username];

            // console.log('newCharactersData', newCharactersData)
            // console.log('characters', userCharacters )

            for(const userChar in newCharactersData) {
                if (typeof newCharactersData[userChar].username !== 'undefined') {
                    if (newCharactersData[userChar].username !== props.username) {
                        newCharactersData[userChar] = new Characters(newCharactersData[userChar]);
                    }
                }
            }
            setUserCharacters(newCharactersData);
        })


        window.addEventListener("keydown", e => {
            userCharacters[props.username].move(e);
            socket.emit('sendData', userCharacters[props.username].state)
        });
        window.addEventListener("keyup", () => {
            userCharacters[props.username].stop()
            socket.emit('sendData', userCharacters[props.username].state)
        });

        return () => {
            window.removeEventListener("keydown", e => userCharacters[0].move(e));
            window.removeEventListener("keyup", () => userCharacters[0].stop());
        };
    } ,[]);

  useEffect(() => {

    const canvas = canvasRef.current;
    canvas.width = 1120;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    const mapImg = new Image();
    mapImg.src = mapImage;
    ctx.drawImage(mapImg, 0, 0);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw background map

    for(const userChar in userCharacters) {

        let frameCount = 0;
        let framelimit = 4;
            // Walking...
        // if (userCharacters[userChar].state.isMoving) {
        //     frameCount++;
        //     if (frameCount >= framelimit) {
        //         frameCount = 0;
        //         userCharacters[userChar].incrementLoopIndex();
        //     }
        //     }
        console.log(userChar)
        console.log(userCharacters)
        userCharacters[userChar].drawFrame(ctx);

        // Text on head.
        ctx.fillText(userCharacters[userChar].state.username, userCharacters[userChar].state.x + 20, userCharacters[userChar].state.y + 10)
        ctx.fillStyle = 'purple';
    }

});

// if user hit the specific position -> redirect to the page
const handleClick = () => {
    navigate("/game/javascript");
}

let page;
if (userCharacters[props.username].state.x >= 420 && userCharacters[props.username].state.x <= 460
    && userCharacters[props.username].state.y >= 120 && userCharacters[props.username].state.y <= 140 ) {
    console.log("im here!!!!")
    page = React.createElement('button', { id:'javascript', onClick : handleClick }, "Language Page")
}


return (
    <div className="game-container" >
        <canvas className="game-canvas" ref={canvasRef}></canvas>
        {page}
    </div>
);
};

export default Canvas;