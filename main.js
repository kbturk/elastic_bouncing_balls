// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const ballSubmit = document.querySelector(".ballSubmit");
const ballField = document.querySelector(".ballField");

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;    
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.fill();
}

//edge detection:
Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
    
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    
    if ((this.y + this.size) >= height) {
        this.velY =-(this.velY);
    }
    
    if ((this.y - this.size) <= 0){
        this.velY = -(this.velY);
    }
    
    this.x += this.velX;
    this.y += this.velY;
}

//collision detection:
Ball.prototype.collisionDetection = function() {
    for (let j = 0; j <balls.length; j++) {
        if (!(this ===balls[j])){
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx**2 + dy**2);
            
            if (distance <= (this.size + balls[j].size)){
                [this.velX, this.velY, balls[j].velX, balls[j].velY] = recalculatingRoute(this,balls[j]);
                balls[j].color = this.color =  `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
            }
        }
    }
}

//elastic colisions:
function recalculatingRoute(ball1,ball2){
    const contactAngle = Math.atan2((ball2.x - ball1.x),(ball2.y - ball1.y));
    const momentAngle1 = Math.atan2(ball1.velX, ball1.velY);
    const momentAngle2 = Math.atan2(ball2.velX, ball2.velY);
    const velo1 = (ball1.velY**2+ball1.velX**2)**0.5;
    const velo2 = (ball2.velY**2+ball2.velX**2)**0.5;
    const temp1 = (velo1*Math.cos(momentAngle1-contactAngle)*(ball1.size**2 - ball2.size**2) + 2*(ball2.size**2) * velo2 * Math.cos(momentAngle2 - contactAngle))/(ball1.size**2+ball2.size**2)
    const temp2 = (velo2*Math.cos(momentAngle2-contactAngle)*(ball2.size**2 - ball1.size**2) + 2*(ball1.size**2) * velo1 * Math.cos(momentAngle1 - contactAngle))/(ball2.size**2+ball1.size**2) 
    const velXnew1 = temp1*Math.cos(contactAngle) + velo1*Math.sin(momentAngle1 - contactAngle)*Math.cos(contactAngle+Math.PI/2);
    const velYnew1 = temp1*Math.sin(contactAngle) + velo1*Math.sin(momentAngle1 - contactAngle)*Math.sin(contactAngle+Math.PI/2)

    const velXnew2 = temp2*Math.cos(contactAngle) + velo2*Math.sin(momentAngle2 - contactAngle)*Math.cos(contactAngle+Math.PI/2);
    const velYnew2 = temp2*Math.sin(contactAngle) + velo2*Math.sin(momentAngle2 - contactAngle)*Math.sin(contactAngle+Math.PI/2);
    
    return [velXnew1, velYnew1, velXnew2, velYnew2]
}

function spotCheck(balls) {
    for (let k = 0; k < balls.length; k++) {
        console.log(balls[k].x, balls[k].y, balls[k].velX, balls[k].velY)
    }
}
let balls = [];

function refreshBalls(){

    balls = [];
    //***Important Default***
    let ballCount = 25;
    console.log(Number.isSafeInteger(ballField.value));
    if (Number.isSafeInteger(Math.round(Number(ballField.value)))){
        ballCount = Math.abs(Math.round(Number(ballField.value)));
        console.log(`ballCount ${ballCount}, ${ballField.value}`);
    }
    while (balls.length < ballCount) {
        let size = random(10,20);
        let ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-7,7),
            random(-7,7),
            `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`,
            size
        );
        balls.push(ball);
    }
}

function loop(){
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);
    
    for (let i = 0; i< balls.length; i++){
        balls[i].update();
        balls[i].collisionDetection();

    }
    for (let l = 0; l< balls.length; l++){
        balls[l].draw();
    }
    ballSubmit.addEventListener("click",refreshBalls);
    requestAnimationFrame(loop);
    
}

ballField.focus();
refreshBalls();
loop();