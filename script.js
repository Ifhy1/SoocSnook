const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cue and red ball data
let cueBall = { x: 300, y: 350, r: 10, vx: 0, vy: 0 };
let redBall = { x: 300, y: 100, r: 10 };

// Game state
let isAiming = false, score = 0;
let mouse = { x: 0, y: 0 };
let timeLeft = 30;
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

// Sound effect (optional: place a hit.mp3 file in your folder)
const hitSound = new Audio('hit.mp3');

// Mouse controls
canvas.addEventListener('mousedown', () => isAiming = true);
canvas.addEventListener('mouseup', shootBall);
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Touch controls
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  isAiming = true;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
});

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  shootBall();
});

function shootBall() {
  if (!isAiming) return;
  isAiming = false;
  cueBall.vx = (cueBall.x - mouse.x) / 10;
  cueBall.vy = (cueBall.y - mouse.y) / 10;
}

function updateBall(ball) {
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vx *= 0.98;
  ball.vy *= 0.98;
  if (Math.abs(ball.vx) < 0.1) ball.vx = 0;
  if (Math.abs(ball.vy) < 0.1) ball.vy = 0;
}

function checkCollision() {
  const dx = cueBall.x - redBall.x;
  const dy = cueBall.y - redBall.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < cueBall.r + redBall.r) {
    score++;
    scoreDisplay.textContent = score;
    hitSound.play();
    resetBalls();
  }
}

function resetBalls() {
  cueBall = { x: 300, y: 350, r: 10, vx: 0, vy: 0 };
  redBall.x = 100 + Math.random() * 400;
  redBall.y = 50 + Math.random() * 150;
}

function drawBall(ball, color) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawAimLine() {
  if (!isAiming) return;
  ctx.beginPath();
  ctx.moveTo(cueBall.x, cueBall.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.strokeStyle = '#fff';
  ctx.stroke();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBall(cueBall);
  drawBall(cueBall, 'white');
  drawBall(redBall, 'red');
  drawAimLine();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Countdown timer
const countdown = setInterval(() => {
  timeLeft--;
  timeDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(countdown);
    alert("⏱️ Time's up! Your score: " + score);
    document.location.reload();
  }
}, 1000);

// Red ball movement every 3 seconds
setInterval(() => {
  redBall.x = 100 + Math.random() * 400;
  redBall.y = 50 + Math.random() * 150;
}, 3000);
