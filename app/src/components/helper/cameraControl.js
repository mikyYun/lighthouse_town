const cameraControl = (keyCode, setCameraPosition, screen, userCharacters, username) => {
  const avatarXPosition = userCharacters[username].state.x;
  const avatarYPosition = userCharacters[username].state.y;
  if (screen.width <= 1250) {
    const horizontalCenter = (screen.width - 150) / 2;
    // LEFT
    if (keyCode === 37) {
      if (
        avatarXPosition < (1105) - horizontalCenter
        &&
        avatarXPosition > horizontalCenter - 30
      ) {
        const increaseX = (positionX) => {
          if (positionX === 0) return positionX;
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
        avatarXPosition > horizontalCenter
        &&
        avatarXPosition < 1105 - horizontalCenter
        ) {
          const decreaseX = (positionX) => {
          if (positionX === horizontalCenter - 1105) return positionX;
          positionX -= 10;
          if (positionX < horizontalCenter - 1105) positionX = horizontalCenter - 1105;
          return positionX;
        };
        setCameraPosition((prev) => ({
          ...prev,
          x: decreaseX(prev.x),
        }));
      }
    }
  }


  if (screen.height < 640) {
    const verticalLimit = 640 - screen.height;
    const verticalCenter = screen.height / 2;
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


  }
};

export default cameraControl;