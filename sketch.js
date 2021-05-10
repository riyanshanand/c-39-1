var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("Pictures/trex_1.png","Pictures/trex_2.png","Pictures/trex_3.png");
  trex_collided = loadAnimation("Pictures/trex_collided.png");
  
  groundImage = loadImage("Pictures/ground.png");
  
  cloudImage = loadImage("Pictures/cloud.png");
  
  obstacle1 = loadImage("Pictures/obstacle1.png");
  obstacle2 = loadImage("Pictures/obstacle2.png");
  obstacle3 = loadImage("Pictures/obstacle3.png");
  obstacle4 = loadImage("Pictures/obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("Pictures/restart.png")
  gameOverImg = loadImage("Pictures/gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth,displayHeight);
  trex = createSprite(displayWidth/10,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.091;
  ground = createSprite(displayWidth/2,displayHeight/2+200,400,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=1;
  gameOver = createSprite(displayWidth/2,displayHeight/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5
  restart = createSprite(displayWidth/2,displayHeight/2+100);
  restart.addImage(restartImg);
  restart.scale = 0.5
  gameOver.scale = 1;
  restart.scale = 1;
  invisibleGround = createSprite(displayWidth/2,displayHeight/2+135,displayWidth,10);
  invisibleGround.visible = false;
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  score = 0;
}
function draw() {
  background("white");
  //displaying score
  textSize(40)
  text("Score: "+ score,displayWidth-200,displayHeight/2-400);
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    if (ground.x <400){
      ground.x = ground.width/2;
    }
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=displayHeight/2+50) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    if(keyDown("LEFT_ARROW")){
      camera.position.x = displayWidth/2;
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
    //spawn the clouds
    spawnClouds();
    //spawn obstacles on the ground
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
    }
    if(keyDown("UP_ARROW")){
      trex.x=trex.x+10;
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
      ground.velocityX = 0;
      trex.velocityY = 0
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);   
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  //stop trex from falling down
  trex.collide(invisibleGround);
  drawSprites();
}
function reset(){
gameState=PLAY  
obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0
}
function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(displayWidth,displayHeight-305,10,40);
   obstacle.velocityX = -(6 + score/100);
   //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -10;
    //assign lifetime to the variable
    cloud.lifetime = 600;
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}