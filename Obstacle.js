class Obstacle {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.img = "./public/images/mrPoopy.png";
  }
  update() {
    const poopImg = new Image();
    poopImg.src = this.img;
    context.drawImage(poopImg, this.x, this.y, this.width, this.height);
  }
  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  crashWith(player) {
    return !(
      player.y + player.height < this.top() ||
      player.y > this.bottom() ||
      player.x + player.width < this.left() ||
      player.x > this.right()
    );
  }
}
