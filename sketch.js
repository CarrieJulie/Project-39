var PLAY = 1;
var END = 0;
var WIN = 2;
var WAIT = 3;

var gameState = PLAY;

var kang, kang_running, kang_collided;
var jungle, invisiblejungle, jungleImage;
var shrub1, shrub2, shrub3;
var gameOverImg, restartImg, winImg;
var jumpSound, collidedSound;
var obstaclesGroup, obstacle1;
var shrubsGroup;
var score=0;
var gameOver, restart, win;

function preload(){
  kang_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png","assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kang_collided = loadAnimation("assets/kangaroo3.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  winImg = loadImage("assets/win.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  invisiblejungle = createSprite(400, 350, width, 10);
  invisiblejungle.visible = false;

  kang = createSprite(150, 275, 10, 10);
  kang.addAnimation("run", kang_running);
  kang.addAnimation("coll", kang_collided);
  kang.changeAnimation("run");
  kang.scale = 0.2;
  kang.setCollider("circle", 0, 0, 200);
  //kang.debug = true;

  gameOver = createSprite(400, 150, 10, 10);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(400, 250, 10, 10);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;

  win = createSprite(400, 150, 10, 10);
  win.addImage(winImg);
  win.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
}

function draw() {
  background(255);

  fill("black");
  textSize(20);
  text("Score: " + score, 400, 200);

  if (gameState === PLAY)
  {
    playing(); 
  }

  if (gameState === END)
  {
    lostGame();
  }

  if (gameState === WAIT)
  {
    resetGame();
  }

  kang.collide(invisiblejungle);
  kang.x = camera.position.x - 270;

  drawSprites();

}

function playing()
{
  if (keyDown("right"))
  {
   kang.position.x += 10;
  }

  jungle.velocityX = -4;

  if (jungle.x < 50)
  {
    jungle.x = 750;
  }

  if (frameCount % 150 == 0) //its 150 TvT
  {
    spawnShrubs();
  }

  if (frameCount % 200 == 0)
  {
    spawnStones();
  }

  if (keyDown("space") && kang.y == 285)
  {
    kang.velocityY = -15;
    jumpSound.play();
  }

  kang.velocityY = kang.velocityY + 0.7;

  if (shrubsGroup.isTouching(kang))
  {
    shrubsGroup.destroyEach();
    score = score + 1;
  }

  if (obstaclesGroup.isTouching(kang))
  {
    collidedSound.play();
    gameState = END;
  }

  if (obstaclesGroup.isTouching(shrubsGroup))
  {
    obstaclesGroup.destroyEach();
  }

  if (score >= 5)
  {
    wonGame();
  }
}

function spawnShrubs()
{

  var shrub = createSprite(900, 330, 10, 10);
  var nums = Math.round(random(1,3))

  if (nums == 1)
  {
    shrub.addImage(shrub1);
    shrub.velocityX = -4;
    shrub.scale = 0.1;

  } else 
  if (nums == 2)
  {
    shrub.addImage(shrub2);
    shrub.velocityX = -4;
    shrub.scale = 0.1;

  } else {
    shrub.addImage(shrub3);
    shrub.velocityX = -4;
    shrub.scale = 0.1;

  }

  shrubsGroup.add(shrub);
  shrub.lifetime = 1000;
}

function spawnStones()
{
  var stone = createSprite(850, 330, 10, 10);
  stone.addImage(obstacle1);
  stone.velocityX = -4;
  stone.scale = 0.1;
  obstaclesGroup.add(stone);
  stone.lifetime = 1000;
}

function lostGame()
{
  kang.changeAnimation("coll");
  shrubsGroup.setVelocityXEach(0);
  obstaclesGroup.setVelocityXEach(0);
  jungle.velocityX = 0;
  jungle.velocityY = 0;
  kang.velocityX = 0;
  kang.velocityY = 0;
  gameOver.visible = true;
  restart.visible = true;

  if (mousePressedOver(restart))
  {
    gameState = WAIT;
  }
}

function resetGame()
{
  kang.changeAnimation("run");
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  win.visible = false;

  gameState = PLAY;
}

function wonGame()
{
  jungle.velocityX = 0;
  kang.changeAnimation("coll");
  obstaclesGroup.setVelocityXEach(0);
  shrubsGroup.setVelocityXEach(0);

  obstaclesGroup.setLifetimeEach(-1);
  shrubsGroup.setLifetimeEach(-1);

  win.visible = true;
  restart.visible = true;

  if (mousePressedOver(restart))
  {
    gameState = WAIT;
  }
}
