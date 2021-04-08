class Player {
  constructor() {
    this.x = 0;
    this.y = 400;
    this.width = 120;
    this.height = 120;
    this.vy = 2;
    this.userPull = 0;
    this.gravityStrength = 0.5;
    this.isCelebrating = false;
    this.isPooping = false;
    this.lives = 3;
  }

  gravity() {
    this.vy = this.vy + (this.gravityStrength - this.userPull);

    if (this.vy < -3) {
      this.vy = -3;
    }
    this.y += this.vy;
    if (this.y < -1) {
      this.y = 0;
    }
  }

  handleCelebration() {
    this.isCelebrating = true;
    setTimeout(() => {
      this.isCelebrating = false;
    }, 1000);
  }

  handlePoop() {
    this.isPooping = true;
    setTimeout(() => {
      this.isPooping = false;
    }, 1000);
  }

  drawUnicorn() {
    const unicornImg = new Image();
    if (this.isCelebrating) {
      unicornImg.src = "./public/images/dabbing.png";
    } else if (this.isPooping) {
      unicornImg.src = "./public/images/poopyCorn.png";
    } else {
      unicornImg.src = "./public/images/unicorn.png";
    }
    context.drawImage(unicornImg, this.x, this.y, this.width, this.height);
  }

  drawPoopyCorn() {
    const poopyCornImg = new Image();
    poopyCornImg.src = "./public/images/poopyCorn.png";
    context.drawImage(poopyCornImg, this.x, this.y, this.width, this.height);
  }

  drawLives() {
    for (let i = 0; i < this.lives; i++) {
      let imageLife = new Image();
      imageLife.src = "./public/images/heart.png";
      context.drawImage(imageLife, 150 + 40 * i, 25, 30, 30); //Q. ?
    }
  }

  moveUnicorn(keyCode) {
    context.clearRect(this.x, this.y, this.width, this.height);
    switch (keyCode) {
      case 37:
        if (this.x > 0) {
          this.x = this.x - 10;
        }
        break;
      case 39:
        if (this.x + this.width <= canvas.width) {
          this.x = this.x + 10;
        }
        break;
    }
  }
}
