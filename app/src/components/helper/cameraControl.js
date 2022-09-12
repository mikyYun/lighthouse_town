const cameraControl = (keyCode, setCameraPosition, screen, userCharacters, username) => {
  // console.log(horCenter, verCenter);
  // console.log(x, y) // avatar position

  // avatar position, screen size (w / h)
  if (screen.width < 1120 || screen.height < 640) {
    const avatarXPosition = userCharacters[username].state.x;
    const avatarYPosition = userCharacters[username].state.y;
    const verticalLimit = 640 - screen.height
    const verticalCenter = screen.height / 2
    const horizontalLimit = 1120 - screen.width
    const horizontalCenter = screen.width / 2
    if (keyCode === 38) {
      if (640 - avatarYPosition > 300) {
        const decreaseY = (positionY) => {
          positionY -= 10;
          if (positionY < 0) positionY = 0;
          return positionY;
        };
        setCameraPosition((prev) => ({
          ...prev,
          y: decreaseY(prev.y)
        }));
      }
    }
    if (keyCode === 40) {

      if (
        avatarYPosition > verticalCenter
         ) {
        const increaseY = (positionY) => {
          if (positionY === verticalLimit) return positionY;
          positionY += 10;
          if (positionY > verticalLimit) positionY = verticalLimit;
          return positionY;
        };
        setCameraPosition((prev) => ({
          ...prev,
          y: increaseY(prev.y)
        }));
      }
    }
    // LEFT
    if (keyCode === 37) {
      if (
        avatarXPosition < 1120 - horizontalCenter
        &&
        avatarXPosition % horizontalCenter > 0
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
    // RIGHT
    if (keyCode === 39) {
      if (
        avatarXPosition < 1120 - 63.5
        &&
        avatarXPosition > horizontalCenter
        ) {
          const decreaseX = (positionX) => {
            if (-positionX === 1120 - screen.width ) return positionX;
            positionX -= 10;
          if (-positionX > 1120 - screen.width) positionX = -(1120 - screen.width);
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