const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0, lift: -5 };
let pipes = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isGameOver = false;
let isGameStarted = false;

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const currentScoreEl = document.getElementById("currentScore");
const highScoreEl = document.getElementById("highScore");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

function generatePipe() 
{
  let gap = 140;
  let gapPosition = Math.floor(Math.random() * (canvas.height - gap - 50)) + 50;
  pipes.push
  (
    {
      x: canvas.width,
      y: gapPosition,
      width: 50,
      gap
    }
  );
}

function resetGame() 
{
  bird.y = 150;
  bird.gravity = 0;
  pipes = [];
  score = 0;
  isGameOver = false;
  gameOverScreen.style.display = "none";
  generatePipe();
  gameLoop();
}

function startGame() 
{
  isGameStarted = true;
  startScreen.style.display = "none";
  generatePipe();
  gameLoop();
}

function endGame() 
{
  isGameOver = true;
  highScore = Math.max(score, highScore);
  localStorage.setItem("highScore", highScore);
  currentScoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  gameOverScreen.style.display = "block";
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() 
{
  ctx.fillStyle = "green";
  pipes.forEach
  (pipe =>
     {
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.y - pipe.gap / 2);
      ctx.fillRect(pipe.x, pipe.y + pipe.gap / 2, pipe.width, canvas.height - (pipe.y + pipe.gap / 2));
     }
  );
}

function updateGame() {
  bird.gravity += 0.3;
  bird.y += bird.gravity;

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) 
    {
      endGame();
    }

  pipes.forEach(pipe => 
  {
    pipe.x -= 2;

    if (pipe.x + pipe.width < 0) 
    {
      pipes.shift();
      score++;
      generatePipe();
    }

    // Collision detection
    if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x && (bird.y < pipe.y - pipe.gap / 2 || bird.y + bird.height > pipe.y + pipe.gap / 2)) 
    {
      endGame();
    }
  });
}

function renderGame() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() 
{
  if (!isGameOver) 
  {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
  }
}

function flap() 
{
  if (!isGameOver && isGameStarted) 
  {
    bird.gravity = bird.lift;
  }
}

window.addEventListener("keydown", e => 
{
  if (e.code === "Space") flap();
});

window.addEventListener("mousedown", flap);

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);
