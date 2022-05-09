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
	speed:5,
	xPosition:300,
	yPosition:500-20-5 //HEIGHT-player.height-5

}
var leftPressed = false
var rightPressed = false

var ctx
var lives = 3

window.onload=startCanvas

function startCanvas(){
	ctx=document.getElementById("myCanvas").getContext("2d")
	// Set up the animation with an interval timer.
	setInterval(updateCanvas, 1)
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
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(10+lifeCount*35, 10, 20,20) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life

	// Draw the player
	ctx.fillStyle="purple"
	ctx.fillRect(player.xPosition,player.yPosition,player.width,player.height)
	}
}
window.addEventListener('keydown', keyDownFunction)
function keyDownFunction(keyboardEvent){
	var keyDown = keyboardEvent.key

	
	if (keyDown=="a"){
		leftPressed = true
	}
	if (keyDown=="d"){
		rightPressed = true
	}
	if(leftPressed==true&&player.xPosition>0){
		player.xPosition -= player.speed
	}
	if(rightPressed==true&&player.xPosition<WIDTH-player.width){
		player.xPosition += player.speed
		}
	//if (keyDown=="a"&&playerSpeed<5||keyDown=="d"&&playerSpeed<5){
	//		playerSpeed=playerSpeed+0.5
	//}
		
	
}
window.addEventListener('keyup', keyUpFunction)

function keyUpFunction(keyboardEvent){
	var keyUp = keyboardEvent.key
	console.log("You just unpressed", keyUp)
	
	if (keyUp=="a"){
		leftPressed = false
	}
	if (keyUp=="d"){
		rightPressed = false
		}
	//	if (keyUp=="a"||keyUp=="d"){
	//		playerSpeed=1
	//}
	}
