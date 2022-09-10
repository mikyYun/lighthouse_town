const cameraControl = (keyCode, cameraPosition, setCameraPosition, screen, userCharacters, username) => {
  // console.log(horCenter, verCenter);
  // console.log(x, y) // avatar position

  // avatar position, screen size (w / h)
  if (screen.width < 1120 || screen.height < 640) {
    const avatarXPosition = userCharacters[username].state.x;
    const avatarYPosition = userCharacters[username].state.y;

    if (keyCode == 38) {
      console.log("UP");
      if (avatarYPosition >= 200) {
        cameraPosition.y = cameraPosition.y - 10;
      }
      // if (cameraPosition.y < 0 && screen.height - 250 > avatarXPosition) {
      //   cameraPosition.y = cameraPosition.y - 10;
      //   if (cameraPosition.y < 0) cameraPosition.y = 0;
      // }
    }
    if (keyCode == 40) {
      
      // if (cameraPosition.y > 0 && screen.height - 250 > avatarXPosition) {
      //   cameraPosition.y = cameraPosition.y + 10;
      //   if (cameraPosition.y > 0) cameraPosition.y = 0;
      // }
    }
    if (keyCode == 37) {
      if (1120 - avatarXPosition > 300
         ) {
        const increaseX = (positionX) => {
          positionX += 10;
          if (positionX > 0) positionX = 0;
          return positionX;
        };
        setCameraPosition((prev) => ({
          ...prev,
          x: increaseX(prev.x),
        }));
      }
    }
    if (keyCode == 39) {
      if (
        avatarXPosition + 200 < 1120
        &&
        avatarXPosition > 200
        ) {
          const decreaseX = (positionX) => {
            positionX -= 10;
            if (positionX > 1120) positionX = 1120;
            return positionX;
          };
          setCameraPosition((prev) => ({
          ...prev,
          x: decreaseX(prev.x),
        }));
      }
    }

  }
};

export default cameraControl;