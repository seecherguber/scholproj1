/*




*/
console.log("started")
const WIDTH = 500
const HEIGHT = 900
var player = {
	width:20,
	height:20,
	speed:1,
	xPosition:200,
	yPosition:HEIGHT-25,
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
var spacePressed = false
var playerDamaged = false
const PROJECTILE1 = {
	HEIGHT: 10,
	WIDTH:2,
	SPEED:5,
}
const ENEMY1={
	WIDTH:20,
	HEIGHT:20,
	SPEED:10,
}
var enemyArray = []
var enemySpawnCooldown = 0
var enemySpawnCooldownNumber = 1000
var projecArray = []
var dashCooldown = 0
var parryCooldown = 0
var ctx
var lives = 3
var gameState = "menu"

window.onload=startCanvas
function startCanvas(){
	ctx=document.getElementById("myCanvas").getContext("2d")
	// Set up the animation with an interval timer.
	setInterval(()=>{
	if(gameState == "menu"){
		mainMenu()
	}
	if(gameState == "game"){
		game()
	}
	if(gameState == "gameOver"){
		gameOver()
	}
	},10)
}
function mainMenu(){
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,WIDTH,HEIGHT)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText("Press Space to Start",WIDTH/2-150,HEIGHT/2)
	if(spacePressed==true){
		gameState="game"
	}
}
function gameOver(){
	enemyArray.splice(0,enemyArray.length)
	enemySpawnCooldownNumber = 1000
	ctx.fillStyle = "black"
	ctx.fillRect(0,0,WIDTH,HEIGHT)
	ctx.fillStyle = "white"
	ctx.font = "30px Arial"
	ctx.fillText("Game Over, press space to restart, r to go to menu",0,HEIGHT/2)
	if(spacePressed==true){
		gameState="game"
		lives=3
		spacePressed=false
	}
}
function game(){	
	//console.log(player)
	// Clear the scren
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
	// the lives system is adapted from a resource from the class
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	lifeCount = 0 // Start at the first life (counting from zero)
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(10+lifeCount*35, 10, 20,20) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life
	}
	if (lives <= 0){
		gameState = "gameOver"
	}
	//this will draw the dash cooldown as a purple bar
	ctx.fillStyle = "purple"
	ctx.fillRect(120,10,dashCooldown/5,20)
	console.log("number of projectiles is, "+projecArray.length)
	//this will draw the parry cooldown as a white bar
	if(parry==0){
	ctx.fillStyle = "white"
	ctx.fillRect(320,10,parryCooldown,20)
	}
// Draw the player
drawPlayer()
//move the player
movePlayer()
shieldFunction()
drawProjectiles()
//move the enemy
//draw the enemy
enemyFunction()
enemySpawnFunction()
	
	//collision stuff

	//var projecNumber = 0 // Start at drop 0
	//while (projecNumber < projecArray.length){ // Keep going until you get to the last drop
	//	console.log("checking collision with projectile & shield")
	//	if (shieldHit(projecArray[projecNumber].xPosition, projecArray[projecNumber].yPosition)){ // Check the drop's xPosition and yPosition
	//	  // delete the projectile
	//	  console.log("spliced?")
	//	   projecArray.splice(projecNumber,1)	
	//	   		// Reset the yPosition to the top
	//	
	//	}
	//	 // Do the next drop
	//	 projecNumber ++
	//}
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
			enemyArray.splice(enemyNumber,1)}
			projecNumber++
		}
		enemyNumber++
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
	constructor(x,y){
		this.xPosition = x
		this.yPosition = y
		this.parried = false
	}
	moveProjectile(){
		if(this.parried==false){
		this.yPosition += PROJECTILE1.SPEED
		}
		if(this.parried==true)
		this.yPosition -= PROJECTILE1.SPEED*2
	}
}
class Enemy{
	constructor(x,y){
		this.xPosition = x
		this.yPosition = y
		this.direction = 'right'
		this.colour = "grey"
		this.enemyShootCooldown = 100
		this.enemyMoveCooldown = 50
	
	}
	moveEnemy(){
		if(this.enemyMoveCooldown==0){
			var random = Math.random()
		if(this.xPosition+ENEMY1.WIDTH>WIDTH){
			this.xPosition = WIDTH-ENEMY1.WIDTH
		}
		if(this.xPosition<0){
			this.xPosition = 0
		
		}
		if(random<0.5){
			if(player.xPosition<this.xPosition){
				this.direction="left"
			}
			if(player.xPosition>this.xPosition){
				this.direction="right"
			}
		if(this.direction=="left"){
			this.xPosition -= ENEMY1.WIDTH
		}
		if(this.direction=="right"){
			this.xPosition += ENEMY1.WIDTH
		}}
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

//else if(shieldPressed==true){
//	ctx.fillStyle = "grey"
//ctx.fillRect(shield.xPosition,shield.yPosition,shield.width,shield.height)
//}
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
			makeEnemy(0,30)
		}
		if(random>0.5){
			makeEnemy(WIDTH,30)
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
				,10)	}
		setInterval(function(){ //cooldown cooldown
			if(dashCooldown==0){
			player.colour="purple"
					clearInterval(cooldownInterval)
			}
		} ,10
		)
	}
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