class Characters {

  constructor(config) {
    this.positionX = config.position.x;
    this.positionY = config.position.y;
    this.img = new Image();
    this.img.src = config.image;
    this.movement_speed = 10;  //?????
    this.facing = {   //?????
      up: 3,
      down: 0,
      left: 1,
      right: 2
    }
    this.currentDirection = this.facing.down;
    this.isMoving = false;
    this.width = 63.5;
    this.height = 63.5;
  }

  move = (e, keyPressed) => {
    // key movement logic
    console.log(e.key)
    if (e.key === 'w') {
      // keyPressed.w = true;
      this.positionY -= this.movement_speed;
      this.currentDirection = this.facing.up;
      this.isMoving = true;
    }
    if (e.key === 'a') {
      // keyPressed.a = true;
      this.positionX -= this.movement_speed;
      this.currentDirection = this.facing.left;
      this.isMoving = true;
    }
    if (e.key === 's') {
      // keyPressed.s = true;
      this.positionY += this.movement_speed;
      this.currentDirection = this.facing.down;
      this.isMoving = true;
    }
    if (e.key === 'd') {
      // keyPressed.d = true;
      this.positionX += this.movement_speed;
      this.currentDirection = this.facing.right;
      this.isMoving = true;
    }
  }

  stop = () => {
    this.isMoving = false;
  }

  drawFrame = (frameX, frameY, posX, posY, ctx) => {
    ctx.drawImage(this.img,
      frameX * this.width, frameY * this.height,
      this.width, this.height,
      posX, posY,
      this.width, this.height
      )
    // this.update
  }
};

export default Characters;


// keypressed : not in constructor
// update within class -> update method

// drawFrame : in Character