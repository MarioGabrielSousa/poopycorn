const canvas = document.getElementById("obstacles");
const context = canvas.getContext("2d");
const backgroundMusic = new Audio(
  "./Limahl - Neverending Story  (Radio Version).mp3"
);
let obstacles = [];
let stars = [];
let gameOver = false;
let intervalId;
let powerUpPoints = 0;

const gameArea = {
  frames: 0,
  points: 0,

  stop: function () {
    cancelAnimationFrame(interval);
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
  score: function () {
    //calcular os pontos pela soma de frames, que não pára a não ser que seja game over
    let gamePoints = Math.floor(this.frames / 5); //Q. Porquê 5?
    this.points = gamePoints + powerUpPoints;
    context.font = "20px Impact";
    context.fillStyle = "white";
    context.fillText(`score: ${this.points}`, 50, 50);
  },
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
  //declarar o jogador chega ao fundo e não o ultrapassa
  let rockBottom = canvas.height - player.height - 45;
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
  updateObstacles();
  checkGameOver();
  checkStar();
  if (!gameOver) {
    gameArea.score();
  }
  intervalId = requestAnimationFrame(updateGameArea);
}

const player = new Player();

document.addEventListener("keydown", (e) => {
  e.preventDefault(); //é o que impede o comportamento default, que neste caso se refere à tecla space, pois faz scroll down do ecrã ao ser pressionada
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
    obstacles[i].x -= 1;
    obstacles[i].update();
  }
  for (let i = 0; i < stars.length; i++) {
    stars[i].x -= 3;
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

  if (gameArea.frames % 1000 === 0) {
    let height = 70;
    let obstacleTop = new Star(90, height, canvas.width, 100);
    stars.push(obstacleTop);
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
    player.handleCelebration();
  }
}

function checkGameOver() {
  //a função que verifica se as condições para o fim de jogo estão reunidas
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
  }
}

document.getElementById("startGame").onclick = () => {
  document.getElementById("gameIntro").style.display = "none";
  document.getElementById("game").style.display = "grid"; //Q. ?

  backgroundMusic.play();
  updateGameArea();
};
