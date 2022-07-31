/*
Title: SPRONK
Author:Joseph Coleman
Date: 31/07/2022
Version: 1.0
*/
console.log("started")
const WIDTH = 500//this is the width of the canvas
const HEIGHT = 900//this is the height of the canvas
var player = {//this is the player object
	width:20,//this is the width of the player
	height:20,//this is the height of the player
	speed:1,//this is the speed of the player(how fast it moves)
	xPosition:200,//this is the x position of the player
	yPosition:HEIGHT-25,//this is the y position of the player
	colour: "purple"//this is the colour of the player
}
var shield = {//this is the shield object
	xPosition: player.xPosition-10,//this is the x position of the shield
	yPosition: player.yPosition-10,//this is the y position of the shield
	width: 40,//this is the width of the shield
	height: 2//this is the height of the shield
}
var parry = 0//this is the number of parry frames left
var leftPressed = false//this is to track whether the left input is pressed
var rightPressed = false//this is to track whether the right input is pressed
var shieldPressed = false//this is to track whether the shield input is pressed
var spacePressed = false//this is to track whether the spacebar is pressed
var rPressed = false//this is to track whether the r key is pressed
var iPressed = false//this is to track whether the i key is pressed
var playerDamaged = false//this is to track whether the player has been damaged
const PROJECTILE1 = {//this is the projectile object
	HEIGHT: 10,//this is the height of the projectile
	WIDTH:2,//this is the width of the projectile
	SPEED:5,//this is the speed of the projectile
}
const ENEMY1={//this is the enemy object
	WIDTH:20,//this is the width of the enemy
	HEIGHT:20,//this is the height of the enemy
	SPEED:10,//this is how far an enemy travels when it moves[]
}
var enemyArray = []// Array of enemies
var enemySpawnCooldown = 0//represents the time until the next enemy spawns
var enemySpawnCooldownNumber = 1000//represents the amount of time used for the start of the enemySpawnCooldown variable
var projecArray = []//this is where data for projectiles is stored
var dashCooldown = 0//this represents the amount of time until you can dash
var parryCooldown = 0//this represents the amount of time untill you can parry
var ctx//this is the canvas context
var lives = 3//this is the number of lives the player has
var gameState = "menu"//this is the state of the game
var score = 0 //this is the score of the player
var highScore = 0//this is the highscore of the player this session
window.onload=startCanvas
function startCanvas(){
	ctx=document.getElementById("myCanvas").getContext("2d")
	setInterval(()=>{//this interval is used to update the game
		if(gameState == "menu"){
			mainMenu()
		}
		if(gameState == "game"){
			game()
		}
		if(gameState == "gameOver"){
			gameOver()
		}
		if(gameState == "instructions"){
			instructions()
		}
	},10)
}
function mainMenu(){//this function displays the main menu
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,WIDTH,HEIGHT)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText("Press Space to Start",WIDTH/2-150,HEIGHT/2)
	ctx.fillText("Press i to see instructions",WIDTH/2-175,HEIGHT/2+50)
	ctx.font = "50px times new roman"
	ctx.fillText("SPRONK",WIDTH/2-100,HEIGHT/2-100)
	if(spacePressed==true){
		gameState="game"
	}
	if(iPressed==true){
		gameState="instructions"
	}
}
function gameOver(){//this function displays the game over screen and resets information for the game
	projecArray.splice(0,projecArray.length)
	enemyArray.splice(0,enemyArray.length)
	enemySpawnCooldownNumber = 1000
	lives=3
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,WIDTH,HEIGHT)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText("GAME OVER",160,HEIGHT/2)
	ctx.fillText("Press Space to Restart",80,HEIGHT/2+50)
	ctx.fillText("Press r to return to the main menu",20,HEIGHT/2+100)
	ctx.fillText("SCORE: "+score,WIDTH/2-50,HEIGHT/2+150)
	ctx.fillText("HIGH SCORE: "+highScore,WIDTH/2-50,HEIGHT/2+200)
	if(spacePressed==true){
		score=0
		gameState="game"
		spacePressed=false
	}
	if(rPressed==true){
		score=0
		gameState="menu"
		rPressed=false
	}
}
function instructions(){//this function displays the instructions
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,WIDTH,HEIGHT)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText("INSTRUCTIONS",WIDTH/2-100,HEIGHT/2-100)
	ctx.fillText("Use A and D to move",WIDTH/2-150,HEIGHT/2)
	ctx.fillText("Use W to parry",WIDTH/2-150,HEIGHT/2+50)
	ctx.fillText("Use Shift to dash",WIDTH/2-150,HEIGHT/2+100)
	ctx.font="20px Arial"
	ctx.fillText("a WHITE BAR represents the parry cooldown",20,90)
	ctx.fillStyle= "red"
	ctx.fillText("lives are displayed in the top left",20,60)
	ctx.fillStyle= "purple"
	ctx.fillText("a PURPLE BAR represents the dash cooldown",20,120)
	ctx.fillStyle= "white"
	ctx.fillText("Press Space to return to the main menu",WIDTH/2-150,HEIGHT/2+150)
	if(spacePressed==true){
		gameState="menu"
		spacePressed=false
	}
	drawPlayer()
	movePlayer()
	shieldFunction()
	livesFunction()
	drawCooldowns()
}
function game(){	//this function is used to run/display the main game loop
	//console.log(player)
	// Clear the scren
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
	
	// Draw the player
	drawPlayer()
	
	//move the player
	movePlayer()
	livesFunction()
	drawCooldowns()
	shieldFunction()
	drawProjectiles()
	//move the enemy
	//draw the enemy
	enemyFunction()
	//spawn the enemy
	enemySpawnFunction()
	scoreFunction()
	//collision stuff ahead
	var projecNumber = 0 
	while (projecNumber < projecArray.length){ 
		console.log("checking parry collision")
		if (parryHit(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition)){	
			console.log("parried?")
			projecArray[projecNumber].parried=true		
		}
	 projecNumber ++
	}
	var projecNumber = 0
	while(projecNumber < projecArray.length){
		console.log('checking projectile collision with player')
		if(projectileHit(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition)){
			console.log('projectile hit player')
			lives--
			projecArray.splice(projecNumber,1)
			playerDamaged=true
		}
		projecNumber++
	}
	var enemyNumber = 0
	while(enemyNumber < enemyArray.length){
		var projecNumber = 0
		while(projecNumber < projecArray.length){
		if (projectileHitEnemy(enemyArray[enemyNumber].xPosition, enemyArray[enemyNumber].yPosition, projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition, projecArray[projecNumber].parried)){
			console.log('projectile hit enemy'+enemyNumber)
			score++
			enemyArray.splice(enemyNumber,1)}
			projecNumber++
		}
		enemyNumber++
	}
}
function drawProjectiles(){//this function draws and triggers the movement of the projectiles
	var projecNumber = 0 
	while (projecNumber < projecArray.length){
		projecArray[projecNumber].moveProjectile()
		projecNumber ++ 
	}if(projecNumber >= projecArray.length){
		console.log("big")
	}
	ctx.fillStyle = "white"
	var projecNumber = 0 
	while (projecNumber < projecArray.length){
		ctx.fillRect(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition, PROJECTILE1.WIDTH, PROJECTILE1.HEIGHT);
		if(projecArray[projecNumber].yPosition>HEIGHT){
			projecArray.splice(projecNumber,1)
		}
		projecNumber ++ 
	}
}
class Projectile{//this class is used to create the projectiles
	constructor(x,y){
		this.xPosition = x
		this.yPosition = y
		this.parried = false
	}
	moveProjectile(){//this function moves the projectile, both towards the player when first fired, and back up if parried
		if(this.parried==false){
		this.yPosition += PROJECTILE1.SPEED
		}
		if(this.parried==true)
		this.yPosition -= PROJECTILE1.SPEED*2
	}
}
class Enemy{//this class is used to create the enemies
	constructor(x,y){
		this.xPosition = x
		this.yPosition = y
		this.direction = 'right'
		this.colour = "grey"
		this.enemyShootCooldown = 100
		this.enemyMoveCooldown = 50
	
	}
	moveEnemy(){//this function moves the enemy
		if(this.xPosition+ENEMY1.WIDTH>WIDTH){
			this.xPosition = WIDTH-ENEMY1.WIDTH
			console.log("hit right wall")
			}
			if(this.xPosition<0){
				this.xPosition = 0
				console.log("hit left wall")
			}
		if(this.enemyMoveCooldown==0){
				var random = Math.random()
			
			if(random<0.5){
				if(player.xPosition<this.xPosition){
					this.direction="left"
				}
				if(player.xPosition>this.xPosition){
					this.direction="right"
				}
				if(player.xPosition==this.xPosition){
					this.direction="still"
				}
				if(this.direction=="left"){
				this.xPosition -= ENEMY1.WIDTH
				}
				if(this.direction=="right"){
				this.xPosition += ENEMY1.WIDTH
				}
				if(this.direction=="still"){
					this.xPosition += 0
				}
			}
			if(random>0.5){
				this.yPosition+=ENEMY1.WIDTH
			}
			this.enemyMoveCooldown = 50
		}
		else{
			this.enemyMoveCooldown--
		}
	}
	
		enemyShoot(){
			if (this.enemyShootCooldown==0){
				projecArray.push(new Projectile(this.xPosition+ENEMY1.WIDTH/2,this.yPosition+ENEMY1.HEIGHT))
				this.enemyShootCooldown = 100
			}
			this.enemyShootCooldown--
	}
}

function drawPlayer(){
	if(player.xPosition+player.width>WIDTH){
		player.xPosition = WIDTH-player.width
	}
	if(player.xPosition<0){
		player.xPosition = 0
	}
	if(dashCooldown==0){
		player.colour="purple"
	}
	if(dashCooldown>0){
		player.colour="red"
	}
	if(playerDamaged==true){
		player.colour="white"
		playerDamaged=false
	}
	if(lives>0){
		ctx.fillStyle=player.colour
		ctx.fillRect(player.xPosition, player.yPosition, player.width, player.height)
	}
}
function movePlayer(){
	if(leftPressed==true){
		player.xPosition -= player.speed
	}
	if(rightPressed==true){
		player.xPosition += player.speed
	}
}
function livesFunction(){//this function draws the lives and triggers GAMEOVER
// the lives system is adapted from a resource from the class
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	lifeCount = 0 // Start at the first life (counting from zero)
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(10+lifeCount*35, 10, 20,20) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life
	}
	if (lives <= 0){//if the player has no lives left, the game is over
		gameState = "gameOver"
	}
}
function drawCooldowns(){//this function draws the cooldowns as bars
	//this will draw the dash cooldown as a purple bar
	ctx.fillStyle = "purple"
	ctx.fillRect(120,10,dashCooldown/5,20)
	console.log("number of projectiles is, "+projecArray.length)
	//this will draw the parry cooldown as a white bar
	if(parry==0){
	ctx.fillStyle = "white"
	ctx.fillRect(320,10,parryCooldown,20)
	}
} 
function shieldFunction(){//displays the shield and handles the parry window
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
}
function scoreFunction(){//this function displays the score
	ctx.fillStyle = "white"
	ctx.font = "20px Arial"
	ctx.fillText("Score: "+score,10,50)
	if(score>=highScore){
		highScore=score
	}
	ctx.fillText("High Score: "+highScore,10,70)
}
function enemyFunction(){
	var enemyNumber=0
	while(enemyNumber<enemyArray.length){
		ctx.fillStyle=enemyArray[enemyNumber].colour
		ctx.fillRect(enemyArray[enemyNumber].xPosition,enemyArray[enemyNumber].yPosition,ENEMY1.WIDTH,ENEMY1.HEIGHT)
		enemyNumber++
	}
	var enemyNumber=0
	while(enemyNumber<enemyArray.length){
		enemyArray[enemyNumber].moveEnemy()
		enemyNumber++
	}
	var enemyNumber=0
	while(enemyNumber<enemyArray.length){
		enemyArray[enemyNumber].enemyShoot()
		enemyNumber++
	}
}
function enemySpawnFunction(){
	if(enemySpawnCooldown==0){
		var random = Math.random()
		if(random<0.5){
			makeEnemy(0,90)
		}
		if(random>0.5){
			makeEnemy(WIDTH,90)
		}
		enemySpawnCooldown=enemySpawnCooldownNumber
		enemySpawnCooldownNumber--
	}
	else{
		enemySpawnCooldown--
	}
}
function makeEnemy(x,y){
	enemyArray.push(new Enemy(x,y))
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
			if(parryCooldown==0&&shieldPressed==false){//shieldPressed is there so it doesnt give parry frames mid block
				parry = 12
				parryCooldown = 100
			}
			shieldPressed = true
		break;
		case "W":
			if(parryCooldown==0&&shieldPressed==false){//shieldPressed is there so it doesnt give parry frames mid block
				parry = 12
				parryCooldown = 100
			}
			shieldPressed = true
		break;
		case "r":
			rPressed=true
		break;
		case "R":
			rPressed=true
		break;
		case "i":
			iPressed=true
		break;
		case "I":
			iPressed=true
		break;
		case " ":
			spacePressed=true
		default:
			break;
	}
	function cooldown(){
		dashCooldown=500
		if (dashCooldown>0){
			player.colour = "red"
			var cooldownInterval =	setInterval(function(){
				if(dashCooldown>0){
				dashCooldown--
				}	
			}
			,10)
		}
		setInterval(function(){ //stops the dash cooldown going down when it hits 0 and changes the player colour back
			if(dashCooldown==0){
			player.colour="purple"
					clearInterval(cooldownInterval)
			}
		} ,10
		)
	}
}
window.addEventListener('keyup', keyUpFunction)

function keyUpFunction(keyboardEvent){//activates when a key is unpressed, and changes vars accordingly
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
	if(keyUp==" "){
		spacePressed=false
	}
	if(keyUp=="r"||keyUp=="R"){
		rPressed=false
	}
	if(keyUp=="i"||keyUp=="I"){
		iPressed=false
	}
	}
// more collisions ahead

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
		// The projectile has hit the shield, return true
		parryCooldown=0
		return(true)
		
	}else{
		// The projectile has not hit the sheild, return false
		
		return(false)
	}

}
function projectileHit(x, y){
	// rectangular collision detection between the projectiles and the player
	if(
		player.xPosition + player.width > x && 
		player.xPosition < x+PROJECTILE1.WIDTH &&
		player.yPosition + player.height > y && 
		player.yPosition < y+PROJECTILE1.HEIGHT
	){
		// the projectile has hit the player, return true
		return(true)
		
	}
	else{
		return(false)
	}
}
function projectileHitEnemy(enemyX, enemyY, projectileX, projectileY, projectileParried){
	// rectangular collision detection between the projectiles and an enemy
	if(
		enemyX + ENEMY1.WIDTH > projectileX &&
		enemyX < projectileX+PROJECTILE1.WIDTH &&
		enemyY + ENEMY1.HEIGHT > projectileY && 
		enemyY < projectileY+PROJECTILE1.HEIGHT
		&& projectileParried == true
	){
		// the projectile has hit the enemy, return true
		return(true)
		
	}
	else{
		return(false)
	}
}