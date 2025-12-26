const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const countText = document.getElementById("count");
const speedControl = document.getElementById("speed");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 200;

let balls = [];

/* Utility functions */
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
}

/* Ball class */
class Ball {
  constructor(x, y, velX, velY, size, color) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // gravity
    this.velY += 0.2;

    this.x += this.velX * speedControl.value;
    this.y += this.velY * speedControl.value;

    // wall collision
    if (this.x + this.size >= canvas.width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= canvas.height) {
      this.velY *= -0.9;
      this.y = canvas.height - this.size;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          this.color = ball.color = randomColor();
        }
      }
    }
  }
}

/* Add balls on mouse click */
canvas.addEventListener("click", (e) => {
  balls.push(
    new Ball(
      e.offsetX,
      e.offsetY,
      random(-5, 5),
      random(-5, 5),
      random(10, 20),
      randomColor()
    )
  );
});

/* Animation loop */
function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  countText.textContent = `Ball count: ${balls.length}`;
  requestAnimationFrame(loop);
}

loop();
