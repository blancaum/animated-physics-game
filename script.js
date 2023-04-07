window.addEventListener('load', function () {
  const canvas = document.querySelector('.js_canvas1');
  //this holds all canvas properties and drawing methods
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  //the code that changes the canvas is here to make it run as little as possible
  //otherwise you could get performance issues
  //this changes the fill of the player circle
  ctx.fillStyle = 'white';
  //this changes the border of the player circle
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'white';

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      //distance between player and mouse
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 10;
    }
    draw(context) {
      context.beginPath();
      //this draws a full circle
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );
      //to limit certain canvas settings only to specific draw calls we can wrap that
      //drawing code between save() and restore() built-in canvas methods
      context.save();
      //this transparency only affects the fill
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
      //draw a line to show where the player will move
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false,
      };

      //event listeners
      //arrow functions inherit the reference to 'this' from the parent scope
      this.canvas.addEventListener('mousedown', (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      this.canvas.addEventListener('mouseup', (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      this.canvas.addEventListener('mousemove', (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
    }

    render(context) {
      this.player.draw(context);
      this.player.update();
    }
  }

  const game = new Game(canvas);

  function animate() {
    //this clears the entire canvas area
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    //this calls its parent function to create an endless animation loop
    window.requestAnimationFrame(animate);
  }
  animate();
});
