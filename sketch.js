var dog,happyDog;
var db,foodS,foodStock;
var dogimg,happydogimg;
var foodObj, fedTime,lastFed;
var feed, addFood;
var state,gamestate;

function preload()
{
dogimg=loadImage("Dog.png");
happydogimg=loadImage("happydog.png")
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png")
bedroom=loadImage("images/Bed Room.png")
}

function setup() {

  db=firebase.database();
  createCanvas(500, 500);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogimg);
  dog.scale=0.15;

  foodStock=db.ref('Food')
  foodStock.on("value",readStock)
  textSize(20);

  foodObj=new Food();

  fedTime=db.ref('FeedTime');
  fedTime.on("value", function(data){
   lastFed=data.val();
  })

  readState=db.ref('gameState');
  readState.on("value",function(data){
    gamestate=data.val();
  })
 
  feed=createButton("Feed the dog")
  feed.position(500,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  textSize(15);
  fill("black")
  text("foodStock:" + foodS, 200,200)

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  if(gamestate!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogimg);
  }
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happydogimg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  db.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gamestate:"Hungry"
  })
}

function addFoods(){
  foodS++;
  db.ref('/').update({
    Food:foodS
  })
}

function update(state){
  db.ref('/').update({
    gameState:state
  })
}