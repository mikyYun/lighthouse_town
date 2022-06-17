import React, {useEffect, useRef, useState, useContext} from 'react';
import mapImage from "./game_img/town-map.png";
import girlImage from "./game_img/girl1.png";
import Characters from "./helper/Characters";
import boyImage from "./game_img/boy1.png";
import townWall from "./game_img/collision_data.js/townWall";
import selectAvatar from "./helper/selecAvatar";
import  { SocketContext } from '../App';

const Canvas = (props) => {
    const { socket } = useContext(SocketContext)
    const canvasRef = useRef(null);
    const [userCharacters, setUserCharacters] = useState({
        [props.username]: new Characters({
            username: props.username,
            x: 150,
            y: 150
        }
    )});

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 1120;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");
        const mapImg = new Image();
        mapImg.src = mapImage;

        let frameCount = 0;
        let framelimit = 4;

        function step () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background map
        ctx.drawImage(mapImg, 0, 0);

        // userCharacters.forEach(userChar => {
        //     // Walking...
        //     if (userChar.state.isMoving) {
        //         frameCount++;
        //         if (frameCount >= framelimit) {
        //           frameCount = 0;
        //           userChar.incrementLoopIndex();
        //         }
        //       }
        //     userChar.drawFrame(ctx);

        //     // Text on head.
        //     ctx.fillText(userChar.state.username, userChar.state.x + 20, userChar.state.y + 10)
        //     ctx.fillStyle = 'purple';
        // });

            // console.log('userCharacters', userCharacters);

        // if (Object.keys(userCharacters).length > 0) {
            // const updatedUserCharacters = {...userCharacters};


            if (typeof userCharacters.moon !== 'undefined') {
                if (userCharacters.moon.state.isMoving) {
                    frameCount++;
                    if (frameCount >= framelimit) {
                        frameCount = 0;
                        userCharacters.moon.incrementLoopIndex();
                    }
                }
                userCharacters.moon.drawFrame(ctx);

                // Text on head.
                ctx.fillText(userCharacters.moon.state.username, userCharacters.moon.state.x + 20, userCharacters.moon.state.y + 10)
                ctx.fillStyle = 'purple';
            }

            // for(const userChar in userCharacters) {
            //     // console.log(userCharacters[userChar].state.username, userCharacters[userChar]);
            //      // Walking...
            //     if (userCharacters[userChar].state.isMoving) {
            //         frameCount++;
            //         if (frameCount >= framelimit) {
            //           frameCount = 0;
            //           userCharacters[userChar].incrementLoopIndex();
            //         }
            //       }
            //     userCharacters[userChar].drawFrame(ctx);

            //     // Text on head.
            //     ctx.fillText(userCharacters[userChar].state.username, userCharacters[userChar].state.x + 20, userCharacters[userChar].state.y + 10)
            //     ctx.fillStyle = 'purple';
            // }


            // setUserCharacters(updatedUserCharacters);
        //}

        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);

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

    socket.on('sendData', data => {
        // console.log('data', data);
        // delete data[username]
        // data.shift(); // Remove first item.

        const newCharactersData = data;
        newCharactersData[props.username] = userCharacters[props.username];

        for(const userChar in newCharactersData) {
            if (typeof newCharactersData[userChar].username !== 'undefined') {
                if (newCharactersData[userChar].username !== props.username) {
                    newCharactersData[userChar] = new Characters(newCharactersData[userChar]);
                }
            }
        }

        // const newCharactersData = [...userCharacters];
        // newCharactersData[0] = userCharacters[0];

        // if (data.username !== userCharacters[0].state.username) {
        //     let alreadyExists = false;

        //     // Loop through and update the character if they already exist.
        //     newCharactersData.forEach((userChar, index) => {
        //         if (data.username === userChar.state.username) {
        //             alreadyExists = true;
        //             // Update existing character.
        //             newCharactersData[index].state = data;
        //         }
        //     });

        //     // If the character couldn't be found, let's add it to the list.
        //     if (alreadyExists === false) {
        //         newCharactersData.push(new Characters(data));
        //     }
        // }
        setUserCharacters(newCharactersData);
    });

    return (
        <div className="game-container">
            <canvas className="game-canvas" ref={canvasRef}></canvas>
        </div>
    );
};

export default Canvas;
