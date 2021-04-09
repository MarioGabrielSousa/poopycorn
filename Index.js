const canvas = document.getElementById("obstacles");
const context = canvas.getContext("2d");
const backgroundMusic = new Audio(
  "./Limahl - Neverending Story  (Radio Version).mp3"
);
let obstacles = [];
let stars = [];
let rainbowPoopies = [];
let fastPoopies = [];
let gameOver = false;
let intervalId;
let powerUpPoints = 0;
const gameArea = {
  frames: 0,
  points: 0,
  showMinusPoints: false,
  showExtraPoints: false,
  stop: function () {
    cancelAnimationFrame(intervalId);
  },
  clear: function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.drawPoopyCorn();
    //Write Game Over
    const imageGameOver = new Image();
    imageGameOver.src = "./public/images/gameOver.png";
    context.drawImage(imageGameOver, 200, 0, 300, 300);
    context.font = "70px Impact";
    context.fillStyle = "black";
    context.fillText(`${this.points} pts.`, 550, 175);
  },
  restart: function () {
   // location.reload()
    context.clearRect(0, 0, canvas.width, canvas.height);
    


rainbowPoopies = [];

    powerUpPoints = 0;
    gameOver = false;
    player.lives = 3;
    player.x = 0;
    obstacles = [];
    stars = [];
    fastPoopies = [];
    this.frames = 0;
    this.points = 0;
    this.score()
    document.getElementById("restartGame").style.display = "none";
    updateGameArea();
    
  },
  score: function () {
    //calcular os pontos pela soma de frames, que não pára a não ser que seja game over
    let gamePoints = Math.floor(this.frames / 5); //Q. Porquê 5? Para dar um número de score aceitável, se não seria enorme
    this.points = gamePoints + powerUpPoints;
    context.font = "20px Impact";
    context.fillStyle = "white";
    context.fillText(`score: ${this.points}`, 50, 50);
  },
  minusPoints: function () {
    if (gameArea.showMinusPoints) {
      context.font = "20px Impact";
      context.fillStyle = "black";
      context.fillText(`-100 pts.`, 50, 75);
    }
  },
  extraPoints: function () {
    if (gameArea.showExtraPoints) {
      context.font = "20px Impact";
      context.fillStyle = "black";
      context.fillText(`+100 pts.`, 50, 75);
    }
  }
};
const backgroundImg = new Image();
backgroundImg.src = "./public/images/finalBackG3.jpg";
const backgroundImage = {
  image: backgroundImg,
  x: 0,
  speed: -1,
  move: function () {
    this.x += this.speed;
    this.x %= canvas.width; //Q. hein?
  },
  draw: function () {
    context.drawImage(this.image, this.x, 0);
    context.drawImage(this.image, this.x + canvas.width, 0); //Q. Hein?
  },
};
function hitBottom() {
  //declara que o jogador chega ao fundo e não o ultrapassa
  let rockBottom = canvas.height - player.height - 41;
  if (player.y > rockBottom) {
    player.y = rockBottom;
    player.vy = 0;
  }
}
function updateGameArea() {
  backgroundImage.move();
  gameArea.clear();
  backgroundImage.draw();
  hitBottom();
  player.gravity();
  player.drawUnicorn();
  player.drawLives();
  gameArea.minusPoints();
  gameArea.extraPoints();
  updateObstacles();
  checkGameOver();
  checkStar();
  checkRainbowPoopy();
  if (gameArea.frames % 200 === 0) {
    gameArea.showMinusPoints = false;
  }
  if (gameArea.frames % 200 === 0) {
    gameArea.showExtraPoints = false;
  }
  if (!gameOver) {
    gameArea.score();
    intervalId = requestAnimationFrame(updateGameArea);
  }
}
const player = new Player();
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (gameOver === false) {
    if (e.keyCode === 32) {
      console.log("y", player.y);
      if (player.y > 20) {
        player.userPull = 0.8;
      } else {
        player.userPull = 0;
        player.vy += 10;
      }
    }
    player.moveUnicorn(e.keyCode);
  }
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 32) {
    player.userPull = 0;
  }
});
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 2;
    obstacles[i].update();
  }
  for (let i = 0; i < fastPoopies.length; i++) {
    fastPoopies[i].x -= 4;
    if (
      (fastPoopies[i].y > 180 &&
        fastPoopies[i].x < 1000 &&
        fastPoopies[i].x > 900) ||
      (fastPoopies[i].y > 180 &&
        fastPoopies[i].x < 800 &&
        fastPoopies[i].x > 700) ||
      (fastPoopies[i].y > 180 &&
        fastPoopies[i].x < 600 &&
        fastPoopies[i].x > 500) ||
      (fastPoopies[i].y > 180 &&
        fastPoopies[i].x < 400 &&
        fastPoopies[i].x > 300) ||
      (fastPoopies[i].y > 180 &&
        fastPoopies[i].x < 200 &&
        fastPoopies[i].x > 100)
    ) {
      fastPoopies[i].y -= 4;
    } else if (
      (fastPoopies[i].y < 370 &&
        fastPoopies[i].x > 0 &&
        fastPoopies[i].x < 100) ||
      (fastPoopies[i].y < 370 &&
        fastPoopies[i].x > 200 &&
        fastPoopies[i].x < 300) ||
      (fastPoopies[i].y < 370 &&
        fastPoopies[i].x > 400 &&
        fastPoopies[i].x < 500) ||
      (fastPoopies[i].y < 370 &&
        fastPoopies[i].x > 600 &&
        fastPoopies[i].x < 700) ||
      (fastPoopies[i].y < 370 &&
        fastPoopies[i].x > 800 &&
        fastPoopies[i].x < 900)
    ) {
      fastPoopies[i].y += 4;
    }
    fastPoopies[i].update();
  }
  for (let i = 0; i < stars.length; i++) {
    stars[i].x -= 4;
    stars[i].update();
  }
  gameArea.frames += 1;
  let positionArray = [350, 500, 700, 800]; //espaçamento
  const gap = Math.floor(Math.random() * positionArray.length);
  if (gameArea.frames % positionArray[gap] === 0) {
    let height = 70;
    let obstacleBottom = new Obstacle(
      90,
      height,
      canvas.width,
      canvas.height - height - 50
    );
    obstacles.push(obstacleBottom);
  }
  if (gameArea.frames % 1200 === 0) {
    let height = 150;
    let otherObstacleBottom = new fastPoop(
      150,
      height,
      canvas.width,
      canvas.height - height - 50
    );
    fastPoopies.push(otherObstacleBottom);
  }
  if (gameArea.frames % 1000 === 0) {
    let height = 70;
    let randomY = Math.floor(Math.random() * (250 - 80 + 1) + 80);
    let obstacleTop = new Star(90, height, canvas.width, randomY);
    stars.push(obstacleTop);
  }
}
function checkRainbowPoopy() {
  let rainbowPoopyIndex;
  const rainbowCrash = fastPoopies.some((rainbowPoopy, index) => {
    rainbowPoopyIndex = index;
    return rainbowPoopy.crashWith(player);
  });

  if (rainbowCrash) {
    if (gameArea.points > 100) {
      powerUpPoints -= 100;
      fastPoopies.splice(rainbowPoopyIndex, 1);
      gameArea.showMinusPoints = true;
    }
  }

}
function checkStar() {
  let starIndex;
  const starCrash = stars.some((star, index) => {
    starIndex = index;
    return star.crashWith(player);
  });
  if (starCrash) {
    powerUpPoints += 100;
    stars.splice(starIndex, 1);
    gameArea.showExtraPoints = true;
    player.handleCelebration();
  }
}
function checkGameOver() {
  const crashed = obstacles.some((obstacle, index) => {
    if (obstacle.crashWith(player) && player.lives < 2) {
      return true;
    } else if (obstacle.crashWith(player)) {
      player.lives--;
      player.handlePoop();
      obstacles.splice(index, 1);
      return false;
    }
    return false;
  });
  if (crashed) {
    gameArea.clear();
    gameOver = true;
    gameArea.stop();
    document.getElementById("restartGame").style.display = "block";
  }
}
document.getElementById("startGame").onclick = () => {
  document.getElementById("gameIntro").style.display = "none";
  document.getElementById("game").style.display = "grid";
  backgroundMusic.loop = true;
  backgroundMusic.play();
  updateGameArea();
};
function restartGame() {
  gameArea.restart();
}
/* function gainPoints() {
  document.getElementById("gameIntro").style.display = "none";
} */
