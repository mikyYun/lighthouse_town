class Sprite {
  constructor({ position, velocity, image
  }) {
    this.positionX = position.x
    this.positionY = position.y
    this.image = image
  }

  draw(ctx) {
    ctx.drawImage(this.image ,this.positionX, this.positionY)
  }
};

export default Sprite;