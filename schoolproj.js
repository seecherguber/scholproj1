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
	speed:0.25,
	xPosition:300,
	yPosition:500-20-5 //HEIGHT-player.height-5

}
var leftPressed = false
var rightPressed = false
var dashCooldown = 0
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

		ctx.fillStyle = "white"
		ctx.fillText(dashCooldown,120,10)
	
	// Draw the player
	drawPlayer()
	//move the player
	movePlayer()
	}
}
function drawPlayer(){
	if(player.xPosition+player.width>WIDTH){
		player.xPosition = WIDTH-player.width
	}
	if(player.xPosition<0){
		player.xPosition = 0
	}
	ctx.fillStyle="purple"
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
		case "Shift":
		if (lastDirection=="left"&&dashCooldown=="0"){
				player.xPosition -= 100
				cooldown()
				console.log("hi3")
				}
		if (lastDirection=="right"&&dashCooldown=="0"){
				player.xPosition += 100
				console.log("hi1")
				cooldown()
				}
		
		break;
		default:
			break;

	}
	function cooldown(){
			console.log("hi")
			dashCooldown=10
			setInterval(function(){
					if(dashCooldown>0){
					dashCooldown=dashCooldown-1
					}
					else{
						console.log("debug")
						clearInterval

					}

				}
				,1000)	
		
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
	if (keyUp=="d"||keyUp=="D"){		//wk3 lesson 1 added caps so it stops moving while shift pressed
		rightPressed = false
		}
	//	if (keyUp=="a"||keyUp=="d"){
	//		playerSpeed=1
	//}
	}
