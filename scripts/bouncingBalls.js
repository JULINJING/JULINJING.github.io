// 定义弹球计数变量
const para = document.querySelector('p');
let count = 0;

// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');//代指画布上的一块允许我们绘制 2D 图形的区域

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min,max) {
const num = Math.floor(Math.random() * (max - min)) + min;
return num;
}

//生成随机颜色
function randomColor() {
return 'rgb(' +
		random(0, 255) + ', ' +
		random(0, 255) + ', ' +
		random(0, 255) + ')';
}

//定义Shape构造器
function Shape(x, y, velX, velY, exists) {
this.x = x;
this.y = y;
this.velX = velX;
this.velY = velY;
this.exists = exists;
}

//为程序中的小球建立模型，继承自Shape
function Ball(x, y, velX, velY, exists, color, size) {
Shape.call(this, x, y, velX, velY, exists);

this.color = color;
this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


//画小球 给小球的原型加上 draw() 方法
Ball.prototype.draw = function() {
ctx.beginPath();//开始画
ctx.fillStyle = this.color;//着色
ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);//arc方法
ctx.fill();//画完填色
};

//更新小球数据
Ball.prototype.update = function() {
//检查小球是否碰到画布的边缘
if ((this.x + this.size) >= width) {
	this.velX = -(this.velX);
}

if ((this.x - this.size) <= 0) {
	this.velX = -(this.velX);
}

if ((this.y + this.size) >= height) {
	this.velY = -(this.velY);
}

if ((this.y - this.size) <= 0) {
	this.velY = -(this.velY);
}

//小球移动一次
this.x += this.velX;
this.y += this.velY;
};

//碰撞检测
Ball.prototype.collisionDetect = function() {
for (let j = 0; j < balls.length; j++) {
	if (this !== balls[j]) {
	const dx = this.x - balls[j].x;
	const dy = this.y - balls[j].y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < this.size + balls[j].size) {
		balls[j].color = this.color = randomColor();
	}
	}
}
}

//定义EvilCircle构造器, 继承自Shape
function EvilCircle(x, y, exists) {
Shape.call(this, x, y, 10, 10, exists);

this.color = 'white';
this.size = 20;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

//定义EvilCircle绘制方法
EvilCircle.prototype.draw = function() {
ctx.beginPath();
ctx.strokeStyle = this.color;
ctx.lineWidth = 3;
ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
ctx.stroke();
};

//定义EvilCircle的边缘检测（checkBounds）方法
EvilCircle.prototype.checkBounds = function() {
if((this.x + this.size) >= width) {
	this.x -= this.size;
}

if((this.x - this.size) <= 0) {
	this.x += this.size;
}

if((this.y + this.size) >= height) {
	this.y -= this.size;
}

if((this.y - this.size) <= 0) {
	this.y += this.size;
}
};

//定义EvilCircle控制设置（setControls）方法 用code方法更加流程
EvilCircle.prototype.setControls = function() {
window.onkeydown = e => {
	switch(e.key) {
	case 'a':
	case 'A':
	case 'ArrowLeft':
		this.x -= this.velX;
		break;
	case 'd':
	case 'D':
	case 'ArrowRight':
		this.x += this.velX;
		break;
	case 'w':
	case 'W':
	case 'ArrowUp':
		this.y -= this.velY;
		break;
	case 's':
	case 'S':
	case 'ArrowDown':
		this.y += this.velY;
		break;
	}
};
};

//定义EvilCircle冲突检测函数
EvilCircle.prototype.collisionDetect = function() {
for(let j = 0; j < balls.length; j++) {
	if( balls[j].exists ) {
	const dx = this.x - balls[j].x;
	const dy = this.y - balls[j].y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	if (distance < this.size + balls[j].size) {
		balls[j].exists = false;
		count--;
		para.textContent = '剩余彩球数：' + count;
	}
	}
}
};

//让球动起来
//储存小球
let balls = [];
while (balls.length < 50) {//最大球数
	let size = random(10, 20);
	let ball = new Ball(
	// 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
	random(0 + size, width - size),
	random(0 + size, height - size),
	random(-4, 4),
	random(-4, 4),
	true,
	randomColor(),
	size
	);
	balls.push(ball);
	count++;
	para.textContent = '剩余彩球数：' + count;
}
//每一帧都自动更新视图
let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();
function loop() {
ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';//透明度可见运动轨迹
ctx.fillRect(0, 0, width, height);//在下一个视图画出来时遮住之前的视图

for (let i = 0; i < balls.length; i++) {
	if((balls[i].velX!==0||balls[i].velY!==0)&&balls[i].exists){
	balls[i].draw();//画
	balls[i].update();//更新
	balls[i].collisionDetect();//检测
	}
}
evil.draw();
evil.checkBounds();
evil.collisionDetect();

requestAnimationFrame(loop);//requestAnimationFrame() 方法再运行一次函数，调用自己
}

loop();//开始调用