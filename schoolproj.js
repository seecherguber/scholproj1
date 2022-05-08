/*
*/
const WIDTH = 1000
const HEIGHT = 500
const PLAYER_WIDTH = 1 //placeholder
const PLAYERHEIGHT = 1 //placeholder
const KNIFE_1_WIDTH = 1 //plc hldr
const KNIFE_1_HEIGHT = 1 //placeholder




var ctx
var lives = 3

window.onload=startCanvas

function startCanvas(){
	ctx=document.getElementById("myCanvas").getContext("2d")
	// Set up the animation with an interval timer.
	setInterval(updateCanvas, 10)
}

function updateCanvas(){
	// Clear the scren
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, WIDTH, HEIGHT,30)
	
	// Every frame, draw all of the lives
	// This loop will draw one red square for each life left
	lifeCount = 0 // Start at the first life (counting from zero)
	while (lifeCount < lives){
		ctx.fillStyle = "red"
		ctx.fillRect(lifeCount*50, 0, 30,30) // Draw the life, use the lifeCounter to control the position
		lifeCount++ // Move to the next life
	}