import selectAvatar from "./selectAvatar";

const facing = {
  up: 3,
  down: 0,
  left: 1,
  right: 2
};
// facing direction
const cycleLoop = [0, 1, 2, 3];
class Characters {

  constructor(config) {
    this.state = {
      username: config.username,
      x: config.x,
      y: config.y,
      currentDirection: config.currentDirection,
      frameCount: config.frameCount,
      avatar: config.avatar
    };
    this.img = new Image();
    this.img.src = selectAvatar(this.state.avatar);
    this.img.style.scale = 2;
    this.movement_speed = 10;
    this.width = 63.5;
    this.height = 63.5;
    this.currentLoopIndex = 0;
    this.frameLimit = 4;
  }



  frameDirection = () => {
    this.state.frameCount += 1;
    if (this.state.frameCount >= this.frameLimit) {
      this.state.frameCount = 0;
    }
  };

  reset = () => {
    this.state.x = 200;
    this.state.y = 420;
    this.frameCount = 0;
    this.currentDirection = 0;
  };

  // add websocket
  move = (keyCode) => {
    if (this.state.x >= 0 && this.state.x <= 1070) {
      if (keyCode === 37 && this.state.x > 10) {
        this.state.x -= this.movement_speed;
        this.state.currentDirection = facing.left;
        this.frameDirection();
      }
      if (keyCode === 39 && this.state.x < 1060) {
        this.state.x += this.movement_speed;
        this.state.currentDirection = facing.right;
        this.frameDirection();
      }
    }
    if (this.state.y >= 0 && this.state.y <= 570) {
      if (keyCode === 38 && this.state.y > 10) {
        this.state.y -= this.movement_speed;
        this.state.currentDirection = facing.up;
        this.frameDirection();
      }
      if (keyCode === 40 && this.state.y < 560) {
        this.state.y += this.movement_speed;
        this.state.currentDirection = facing.down;
        this.frameDirection();
      }
    }
  };

  stop = (keyCode) => {
    if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
      this.state.frameCount = 0;
    }
  };

  drawFrame = (ctx) => {
    const frameX = cycleLoop[this.state.frameCount];
    ctx.drawImage(this.img,
      frameX * this.width, this.state.currentDirection * this.height,
      this.width, this.height,
      this.state.x, this.state.y,
      this.width, this.height
    );

  };

  showName = (ctx) => {
    // name over head
    ctx.font = 'bold 25px monospace';
    ctx.fillRect(
      this.state.x,
      this.state - 10,
      80,
      20
    );
    ctx.fillStyle = "black";
    ctx.fillText(
      this.state.username,
      this.state.x + 10,
      this.state.y + 5
    );
  };


  clearChat = (ctx) => {
    this.message = "";
    ctx.fillText(
      "",
      this.state.x - 5,
      this.state.y - 13
    );
  };

  showChat = (ctx, msg) => {
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = "blue";
    // this.message = ""
    // const lineHeight = 30
    const lines = msg.split(" ").filter(word => word !== "");
    let messageYPosition = lines.length % 2 === 0 ? (
      ((lines.length / 2) * 20 - 20)
      ) : (
      ((lines.length / 2 - lines.length % (2 / 2)) * 20 - 20)
      )
    for (let i = 0; i < lines.length; i += 2) {
      let message;
      if (lines[i + 1]) {
        message = `${lines[i]} ${lines[i + 1]}`;
      } else {
        message = lines[i];
      }
      if (i > 1) {
        messageYPosition -= 20;
      }
      // this.message += lines[i]
      ctx.fillText(
        message,
        this.state.x - 5,
        this.state.y - messageYPosition - 20,
      );
    }
  };
  // ctx.fillText(
  //   this.message,
  //   this.state.x - 5,
  //   this.state.y - messagePosition, 
  //   );
  // }
};

export default Characters;