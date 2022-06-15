
const facing = {
  up: 3,
  down: 0,
  left: 1,
  right: 2
}

const cycleLoop = [0,1,2,3];
class Characters {

  constructor(config) {
    this.state = {
      username: config.username,
      x: config.x,
      y: config.y,
      currentDirection: facing.down,
      isMoving: false
    }
    this.img = new Image();
    this.img.src = config.image;
    this.movement_speed = 10;
    this.width = 63.5;
    this.height = 63.5;
    this.currentLoopIndex = 0;
  }

  // add websocket
  move = (e) => {
    console.log('inside move', this)
    if (e.key === 'w') {
      // keyPressed.w = true;
      this.state.y -= this.movement_speed;
      // console.log(this.state.y)
      this.state.currentDirection = facing.up;
      this.state.isMoving = true;
    }
    if (e.key === 'a') {
      // keyPressed.a = true;
      this.state.x -= this.movement_speed;
      this.state.currentDirection = facing.left;
      this.state.isMoving = true;
    }
    if (e.key === 's') {
      // keyPressed.s = true;
      this.state.y += this.movement_speed;
      this.state.currentDirection = facing.down;
      this.state.isMoving = true;
    }
    if (e.key === 'd') {
      // keyPressed.d = true;
      this.state.x += this.movement_speed;
      this.state.currentDirection = facing.right;
      this.state.isMoving = true;
    }
  }

  stop = () => {
    this.state.isMoving = false;
  }

  incrementLoopIndex = () => {
    this.currentLoopIndex += 1;
    if (this.currentLoopIndex >= cycleLoop.length) {
      this.currentLoopIndex = 0;
    }
  }

  drawFrame = (ctx) => {
    // console.log('inside drawFrame')
    const frameX = cycleLoop[this.currentLoopIndex];
    ctx.drawImage(this.img,
      frameX * this.width, this.state.currentDirection * this.height,
      this.width, this.height,
      this.state.x, this.state.y,
      this.width, this.height
      )
    // this.update
  }
};

export default Characters;


// keypressed : not in constructor
// update within class -> update method

// drawFrame : in Character