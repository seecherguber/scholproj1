/*
*/
const WIDTH = 1000
const HEIGHT = 500
//const PLAYERWIDTH = 20 //placeholder
//const PLAYERHEIGHT = 20 //placeholder
//const KNIFE1WIDTH = 1 //plc hldr
//const KNIFE1HEIGHT = 1 //placeholder
//var playerXPosition = 300
//var playerYPosition = HEIGHT-PLAYERHEIGHT-5
//var playerSpeed = 5
var player = {
	width:20,
	height:20,
	speed:0.5,
	xPosition:20,
	yPosition:500-20-5, //HEIGHT-player.height-5
	colour: "purple"
}
var shield = {
xPosition: player.xPosition-10	,
yPosition: player.yPosition-10 ,
width: 40,
height: 2
}
var parry = 0
var leftPressed = false
var rightPressed = false
var shieldPressed = false
const PROJECTILE1 = {
	HEIGHT: 10,
	WIDTH:2,
	SPEED:1
}
var projecArray = []
var dashCooldown = 0
var parryCooldown = 0
var ctx
var lives = 3

window.onload=startCanvas

function startCanvas(){
	ctx=document.getElementById("myCanvas").getContext("2d")
	// Set up the animation with an interval timer.
	setInterval(updateCanvas, 10)
}

function updateCanvas(){
	
	//console.log(player)
	// Clear the scren
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
	// the lives system is adapted from a resource from the class
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	lifeCount = 0 // Start at the first life (counting from zero)
	ctx.fillStyle = "purple"
	ctx.fillRect(120,10,dashCooldown*10,20)
	console.log("number of projectiles is, "+projecArray.length)
// Draw the player
drawPlayer()
//move the player
movePlayer()
shieldFunction()
drawProjectiles()
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(10+lifeCount*35, 10, 20,20) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life

	
	}
	//collision stuff

	var projecNumber = 0 // Start at drop 0
	while (projecNumber < projecArray.length){ // Keep going until you get to the last drop
		console.log("checking collision")
		if (shieldHit(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition)){ // Check the drop's xPosition and yPosition
		  // Change the umbrella color
		  console.log("spliced?")
		   projecArray.splice(projecNumber,1)	
		   		// Reset the yPosition to the top
		
		}
		 // Do the next drop
		 projecNumber ++
	}
	var projecNumber = 0 // Start at drop 0
	while (projecNumber < projecArray.length){ // Keep going until you get to the last drop
		console.log("checking parry collision")
		if (parryHit(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition)){ // Check the drop's xPosition and yPosition
		  // Change the umbrella color
		  console.log("parried?")
		   projecArray[projecNumber].parried=true	
		   		// Reset the yPosition to the top
		
		}
		 // Do the next drop
		 projecNumber ++
	}
}
function drawProjectiles(){
	var projecNumber = 0 // Start at drop 0
	while (projecNumber < projecArray.length){ // Keep going until you get to the last drop
		projecArray[projecNumber].moveProjectile()
		projecNumber ++ // Do the next drop
	}if(projecNumber >= projecArray.length){
		console.log("big")
	}
	ctx.fillStyle = "white"
	var projecNumber = 0 // Start at drop 0
	while (projecNumber < projecArray.length){ // Keep going until you get to the last drop
		ctx.fillRect(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition, PROJECTILE1.WIDTH, PROJECTILE1.HEIGHT);
		if(projecArray[projecNumber].yPosition>HEIGHT){
			projecArray.splice(projecNumber,1)
		}
		
		projecNumber ++ // Do the next drop
	}
}
class Projectile{ 
	
	constructor(x){
		
		this.xPosition = x
		
		this.yPosition = 0
		this.parried = false
	}
	moveProjectile(){
		if(this.parried==false){
		this.yPosition += PROJECTILE1.SPEED
		}
		if(this.parried==true)
		this.yPosition -= PROJECTILE1.SPEED+0.5

	}
}
function drawPlayer(){
	if(player.xPosition+player.width>WIDTH){
		player.xPosition = WIDTH-player.width
	}
	if(player.xPosition<0){
		player.xPosition = 0
	}
	ctx.fillStyle=player.colour
	ctx.fillRect(player.xPosition,player.yPosition,player.width,player.height)
}
function movePlayer(){
	if(leftPressed==true){
		player.xPosition -= player.speed
	}
	if(rightPressed==true){
		player.xPosition += player.speed
		}
}
function shieldFunction(){
	console.log(parryCooldown)
	shield.xPosition=player.xPosition-10
	shield.yPosition=player.yPosition-10
	if(parryCooldown>0){
		parryCooldown-=1
	}
	if(shieldPressed==true&&parry>0){
ctx.fillStyle = "white"
ctx.fillRect(player.xPosition-15,player.yPosition-15,50,2)
parry-=1

	}
else if(shieldPressed==true){
	ctx.fillStyle = "grey"
ctx.fillRect(shield.xPosition,shield.yPosition,shield.width,shield.height)
}
}
window.addEventListener('keydown', keyDownFunction)
function keyDownFunction(keyboardEvent){
	var keyDown = keyboardEvent.key			//new movement code
	switch(keyDown){
		case "a":
			leftPressed = true
			lastDirection = "left"
			break;
		case "d":
			rightPressed = true
			lastDirection = "right"

		break;
		case "A":
			leftPressed = true
			lastDirection = "left"
			break;
		case "D":
			rightPressed = true
			lastDirection = "right"
		break;
		case "Shift":
		if (lastDirection=="left"&&dashCooldown=="0"){
				player.xPosition -= 100
				cooldown()
				}
		if (lastDirection=="right"&&dashCooldown=="0"){
				player.xPosition += 100
				cooldown()
				}
		
		break;
		case "w":
			projecArray.push(new Projectile(50))
		
			if(parryCooldown==0&&shieldPressed==false){//shieldPressed is there so it doesnt give parry frames mid block
				parry = 20
				
				parryCooldown = 100
			}
			shieldPressed = true
		default:
			break;

	}
	function cooldown(){
			dashCooldown=10
			if (dashCooldown>0){
				player.colour = "red"
		var cooldownInterval =	setInterval(function(){
					if(dashCooldown>0){
					dashCooldown=dashCooldown-0.0625
					}	
				}
				,62.5)	}
		setInterval(function(){ //cooldown cooldown
			if(dashCooldown==0){
			player.colour="purple"
	
					clearInterval(cooldownInterval)

			}
		} ,10
		)
	}

	////Old movement code
	//if (keyDown=="a"){
	//	leftPressed = true
	//	lastDirectionRight = false
	//	lastDirectionLeft = true
	//}
	//if (keyDown=="d"){
	//	rightPressed = true,
	//	lastDirectionLeft = false
	//	lastDirectionRight = true
	//}
//	if(leftPressed==true&&player.xPosition>0){
//		player.xPosition -= player.speed
//	}
//	if(rightPressed==true&&player.xPosition<WIDTH-player.width){
//		player.xPosition += player.speed
//		}
//		if(keyDown=="Shift"&&lastDirectionLeft==true&&player.xPosition>0){
//			player.xPosition -= player.speed+100
//		}
//		if(keyDown=="Shift"&&lastDirectionRight==true&&player.xPosition<WIDTH-player.width){
//			player.xPosition += player.speed+100
//		
//			}

	//if (keyDown=="a"&&playerSpeed<5||keyDown=="d"&&playerSpeed<5){
	//		playerSpeed=playerSpeed+0.5
	//}
	
	
}
window.addEventListener('keyup', keyUpFunction)

function keyUpFunction(keyboardEvent){
	var keyUp = keyboardEvent.key
	console.log("You just unpressed", keyUp)
	//stopping the player moving
	if (keyUp=="a"||keyUp=="A"){
		leftPressed = false
	}
	if (keyUp=="d"||keyUp=="D"){		//wk3 lesson 1 added caps so you can stop moving while shift pressed
		rightPressed = false
		}
	if(keyUp=="w"||keyUp=="W"){
		shieldPressed = false
	
		parry=0
	}
	//	if (keyUp=="a"||keyUp=="d"){
	//		playerSpeed=1
	//}
	}
//collisions ahead
function shieldHit(projecX, projecY){

	// Rectangular collision detection between the projectiles and the shield
	if(
		shieldPressed == true &&
		parry==0	&&
		shield.xPosition + shield.width > projecX && 
		shield.xPosition < projecX+PROJECTILE1.WIDTH &&
		shield.yPosition+ shield.height > projecY && 
		shield.yPosition < projecY+PROJECTILE1.HEIGHT
	){
		// The raindrop has hit the umbrella, return true
		
		return(true)
		
	}else{
		// The raindrop has not hit the umbrella, return false
		
		return(false)
	}
}
function parryHit(projecX, projecY){

	// Rectangular collision detection between the projectiles and the shield
	if(
		shieldPressed == true &&
		parry>0	&&
		shield.xPosition-5 + shield.width+10 > projecX && 
		shield.xPosition-5 < projecX+PROJECTILE1.WIDTH &&
		shield.yPosition-5+ shield.height > projecY && 
		shield.yPosition-5 < projecY+PROJECTILE1.HEIGHT
	){
		// The raindrop has hit the umbrella, return true
		parryCooldown=0
		return(true)
		
	}else{
		// The raindrop has not hit the umbrella, return false
		
		return(false)
	}
}