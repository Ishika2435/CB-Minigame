var PLAY = 1;
var END = 0;
var gameState = PLAY;

var CB, CB_running, CB_collided;
var ground, invisibleGround, backGroundImage;

var obstaclesGroup, animal1, animal2, animal3, ball1, ball2, ball3, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6 ;

var score=0;

var gameOver, restart;

var backgroundSound, jumpSound

function preload(){
  CB_running = loadAnimation("CB1.png","CB2.png");
  CB_jumping = loadAnimation("CB3.png");
  CB_collided = loadAnimation("CB9_collided.png");
  CB_crawling = loadAnimation("CB8.png")
  
  backGroundImage = loadImage("backgroung1.png", "background2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("animal1.png");
  obstacle2 = loadImage("animal2.png");
  obstacle3 = loadImage("animal3.png");
  obstacle4 = loadImage("ball1.png");
  obstacle5 = loadImage("ball2.png");
  obstacle6 = loadImage("ball3.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  
  backgroundSound = loadSound("Turtle Crusher.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  CB = createSprite(50,180,20,50);
  
  CB.addAnimation("running", CB_running);
  CB.addAnimation("collided", CB_collided);
  CB.addAnimation("jumping", CB_jumping);
  CB.addAnimation("crawling", CB_crawling);
  CB.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //CB.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && CB.y >= 159) {
      CB.velocityY = -12;
      CB.addanimation("jumping", CB_jumping);
    }
    
    if(keyDown("c") && CB.y >= 159) {
      CB.addAnimation("crawling", CB_crawling);
    }
  
    CB.velocityY = CB.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    CB.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(CB)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    CB.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the CB animation
    CB.changeAnimation("collided",CB_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(animal1);
              break;
      case 2: obstacle.addImage(animal2);
              break;
      case 3: obstacle.addImage(animal3);
              break;
      case 4: obstacle.addImage(ball1);
              break;
      case 5: obstacle.addImage(ball2);
              break;
      case 6: obstacle.addImage(ball3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  CB.changeAnimation("running",CB_running);
  
 
  
  score = 0;
  
}