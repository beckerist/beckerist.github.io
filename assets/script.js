const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Settings you can change
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const slingshotBaseX = canvas.width / 3;
const slingshotBaseY = canvas.height; // Slingshot at the bottom, this all needs to be adjusted to be variable
const ballRadius = 30;
const gravity = 1; // Gravity force
const targetRadius = 30;
const maxtargetX = canvas.width * 0.8; // Target area boundaries
const mintargetX = canvas.width * 0.2;
const maxtargetY = canvas.height * 0.2;
const mintargetY = canvas.height / 2;
const targetFPS = 60;
const interval = 1000 / targetFPS; 
const version = "0.6.0107b";

// Variables that the program changes
let isDragging = false;
let isHit = false;
let mouseY = 0;
let mouseX = 0;
let score = 0;
let ballY = slingshotBaseY - 35; // Start directly at the string
let ballX = slingshotBaseX;
let ballVelocityY = 0;
let ballVelocityX = 0;
let targetSteps = 0;
let targetX = Math.floor(Math.random() * (maxtargetX - mintargetX)) + mintargetX;
let targetY = Math.floor(Math.random() * (maxtargetY - mintargetY)) + mintargetY;
let targetDirection = "down";
let lastTime = 0; 

base_image = new Image();
base_image.src = '/assets/images/JLsprite.png';
base_image.onload = function(){
    ctx.drawImage(base_image, targetX, targetY, 64, 64);
}


// Functions
function drawSlingshot() {
    // Draw the slingshot's Y shape
    ctx.beginPath();
    ctx.moveTo(slingshotBaseX - 50, slingshotBaseY - 35); // Top left
    ctx.lineTo(slingshotBaseX, slingshotBaseY + 40); // Middle
    ctx.lineTo(slingshotBaseX + 50, slingshotBaseY - 35); // Top right
    ctx.strokeStyle = '#4d647ada';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Draw the bottom line of the slingshot
    ctx.beginPath();
    ctx.moveTo(slingshotBaseX, slingshotBaseY + 40); // Back to the middle
    ctx.lineTo(slingshotBaseX, slingshotBaseY + 70); // To the bottom of the Y
    ctx.strokeStyle = '#563412af';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw the horizontal strings
    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(slingshotBaseX - 50, slingshotBaseY - 30); // Left end of the string
        ctx.lineTo(ballX, ballY); // To the center of the ball
        ctx.strokeStyle = '563412af';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(slingshotBaseX + 50, slingshotBaseY - 30); // Right end of the string
        ctx.lineTo(ballX, ballY); // To the center of the ball
        ctx.strokeStyle = '563412af';
        ctx.lineWidth = 10;
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(slingshotBaseX - 50, slingshotBaseY - 30); // Left end of the string
        ctx.lineTo(slingshotBaseX + 50, slingshotBaseY - 30); // Right end of the string
        ctx.strokeStyle = '563412af';
        ctx.lineWidth = 10;
        ctx.stroke();
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#cc8500';
    ctx.fill();
    ctx.closePath();
}

function drawHook() {
    const img = new Image();
    img.src = '/assets/images/hook.png';
    img.onload = function() {
        ctx.drawImage(img, ballX, ballY, 14, 22);
     };
}

function drawSVGTarget() {
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#c9090999';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffffff';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius - 20, 0, Math.PI * 2);
    ctx.fillStyle = '#c9090999';
    ctx.fill();
    ctx.closePath();
}


function drawTarget() {
    ctx.drawImage(base_image, targetX, targetY, 32, 32);
}

function drawDirtPath() {    ctx.fillStyle = '#8B4513'; // Dirt color
    ctx.beginPath();
    
    const pathWidth = 25;  // Width of the path
    let x = 0;  // Start X position
    let y = 20; // Start just below the top

    // Move to starting point
    ctx.moveTo(x, y);

    // Draw winding path
    while (y < (canvas.height / 2)) {
        // Move right
        ctx.lineTo(x + 100, y);
        x += 100;
        
        // Turn down
        y += pathWidth;
        ctx.lineTo(x, y);
        
        // Move right again
        ctx.lineTo(x + 100, y);
        x += 100;

        // Turn down again
        y += pathWidth;
        ctx.lineTo(x, y);
    }

    // Final turn left towards the castle
    ctx.lineTo(x - 60, y + 40); // Adjust to end close to the castle
    ctx.lineTo(x - 60, canvas.height / 2); // Down towards the castle
    ctx.lineTo((canvas.width / 2) - 25, canvas.height / 2); // To center where the castle will be

    ctx.closePath();
}

function drawCastle() {
    const castleWidth = 50; // Width of the castle
    const castleHeight = 40; // Height of the castle
    const castleX = (canvas.width / 2) - (castleWidth / 2); // Center the castle at the dirt path
    const castleY = (canvas.height / 2) - castleHeight; // Position above the path

    // Draw the castle body
    ctx.fillStyle = '#A9A9A9'; // Castle color
    ctx.fillRect(castleX, castleY, castleWidth, castleHeight); // Main castle building

    // Draw towers
    ctx.fillStyle = '#B0C4DE'; // Tower color
    const towerWidth = 20; // Width of the towers
    const towerHeight = 30; // Height of the towers
    ctx.fillRect(castleX - 15, castleY - towerHeight + 5, towerWidth, towerHeight); // Left tower
    ctx.fillRect(castleX + castleWidth - 5, castleY - towerHeight + 5, towerWidth, towerHeight); // Right tower

    // Add roofs
    ctx.fillStyle = '#800000'; // Roof color
    ctx.beginPath();
    ctx.moveTo(castleX, castleY); // Bottom left of roof
    ctx.lineTo(castleX - 5, castleY - towerHeight + 5); // Left roof peak
    ctx.lineTo(castleX + 15, castleY); // Bottom middle of roof
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(castleX + castleWidth, castleY); // Bottom right of roof
    ctx.lineTo(castleX + castleWidth + 5, castleY - towerHeight + 5); // Right roof peak
    ctx.lineTo(castleX + castleWidth - 15, castleY); // Bottom middle of roof
    ctx.closePath();
    ctx.fill();
}

function explodeTarget() {

    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#29099999';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffffff';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius - 20, 0, Math.PI * 2);
    ctx.fillStyle = '#c9090999';
    ctx.fill();
    ctx.closePath();

}

function drawUI() {
    // Background
    //ctx.fillStyle = 'lightblue'; // background color    
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Score Board
    const scoreX = 0;
    const scoreY = 0;
    const scoreWidth = 100;
    const scoreHeight = 50;
    ctx.fillStyle = '#4C5FA0'; // Blue
    ctx.fillRect(scoreX, scoreY, scoreWidth, scoreHeight);
    ctx.strokeStyle = '#FAFAFF'; // White border
    ctx.roundRect(scoreX, scoreY, scoreWidth, scoreHeight, 2);
    ctx.fillStyle = '#FAFAFF'; // White text
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Score: ' + score, scoreX + scoreWidth / 2, scoreY + scoreHeight / 2);

    // Debug Board
    const debugBoxX = 100;
    const debugBoxY = 0;
    const debugBoxWidth = 300;
    const debugBoxHeight = 50;
    ctx.fillStyle = '#A05F4C'; // Red
    ctx.fillRect(debugBoxX, debugBoxY, debugBoxWidth, debugBoxHeight);
    ctx.strokeStyle = '#FAFAFF'; // White border
    ctx.roundRect(debugBoxX, debugBoxY, debugBoxWidth, debugBoxHeight, 2);
    ctx.fillStyle = '#FAFAFF'; // White text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TY: ' + Math.round(targetY) + '-- TX: ' + Math.round(targetX), debugBoxX + debugBoxWidth / 2, debugBoxY + debugBoxHeight / 2);
}

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballVelocityX = 0;
    ballVelocityY = 0;
    targetX = Math.floor(Math.random() * (maxtargetX - mintargetX)) + mintargetX;
    targetY = Math.floor(Math.random() * (maxtargetY - mintargetY)) + mintargetY;
    ballY = slingshotBaseY - 35; // Start directly at the string
    ballX = slingshotBaseX;
    update();
}

function resetScore() {
    score = 0;
}
function roundToTwo(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function moveTarget() {
    targetSteps++;
    if (targetSteps > 20) {
            targetDirection = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
            targetSteps = 0;
        }
    else {
        switch (targetDirection) {
            case 'up':
                if (targetY > mintargetY)
                {
                    targetY = targetY - 5;
                }   
                break;
            case 'down':
                if (targetY < maxtargetY)
                {
                    targetY = targetY + 5;
                }   
                break;
            case 'left':
                if (targetX > mintargetX)
                {
                    targetX = targetX - 5;
                }   
                break;
            case 'right':
                if (targetX < maxtargetX)
                {
                    targetX = targetX + 5;
                }   
                break;
            default:
                explodeTarget();
            }
        }
}

function update(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= interval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //drawDirtPath();
        //drawCastle();
        if (isHit) {
            drawSVGTarget();
        }
        else {
            drawTarget();
        }
        drawSlingshot();
        drawBall();
        drawUI();
        moveTarget();
        lastTime = currentTime;

        if (!isDragging) {
            if (ballVelocityY !== 0 || ballX !== slingshotBaseX) {
                ballVelocityY += gravity; // Gravity effect
                //ballVelocityX -= 0.5; // Fake friction gound (fix)
                ballY += ballVelocityY; // Update Y position
                ballX -= ballVelocityX; // Update X position

                // Check for bounce on the ground
                if (ballY + ballRadius >= slingshotBaseY) {
                    ballY = slingshotBaseY - ballRadius; // Prevent going below ground
                    ballVelocityY = -ballVelocityY * 0.6; // Bounce effect, reverse and reduce
                    if (Math.abs(ballVelocityY) < 5 && Math.abs(ballVelocityX) < 5) {
                        resetGame(); // Reset if the ball is just rolling on the platform
                    }
                }

                // Check for top boundary collision
                if (ballY - ballRadius <= 0) {
                    ballY = ballRadius; // Prevent going out of bounds at the top
                    ballVelocityY = -ballVelocityY * 0.4; // Bounce off the top edge
                }

                // Check for target boundary collision
                if (Math.sqrt(((ballX - targetX) ** 2) + ((ballY - targetY) ** 2)) <= (ballRadius * 1.5)) {
                    score++;
                    if (isHit) {
                        isHit = false;
                        resetGame();
                    }
                    else {
                        isHit = true;
                    }
                }

                // Check for left and right boundary collisions
                if (ballX + ballRadius >= canvas.width) {
                    ballX = canvas.width - ballRadius; // Prevent going out of bounds on the right
                    ballVelocityX = -ballVelocityX * 0.8; // Bounce off the right edge and slow
                } else if (ballX - ballRadius <= 0) {
                    ballX = ballRadius; // Prevent going out of bounds on the left
                    ballVelocityX = -ballVelocityX * 0.8; // Bounce off the left edge and slow
                }
            }    
        } else {
            ballY = Math.max(mouseY, slingshotBaseY - 35); // Make sure the ball doesn't go above the slingshot when pulling
            //ballY = mouseY;
            ballX = mouseX; // Follow that mouse!
        }
    }
    //console.log('Velocity X: ' + roundToTwo(ballVelocityX) + ' | Velocity Y: ' + roundToTwo(ballVelocityY) + ' | Ball X: ' + roundToTwo(ballX) + ' | Ball Y: ' + roundToTwo(ballY));
    requestAnimationFrame(update);
}

// Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
        mouseX = e.clientX - rect.left;
        console.log("bvX: " + ballVelocityX + " - bvY: " + ballVelocityY);
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        ballVelocityY = (mouseY - slingshotBaseY) * 2; // Fling back in the opposite speed relative to distance from the start
        ballVelocityX = (mouseX - slingshotBaseX) / 5; // Adjust the value for smoother left to right movement.
        console.log("bvX: " + ballVelocityX + " - bvY: " + ballVelocityY);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
        mouseX = e.clientX - rect.left;
    }
});

// Touch event listeners
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouseY = touch.clientY - rect.top;
    mouseX = touch.clientX - rect.left;
    e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseY = touch.clientY - rect.top;
        mouseX = touch.clientX - rect.left;
        e.preventDefault();
    }
});

canvas.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        ballVelocityY = (mouseY - slingshotBaseY) * 2; // Fling back in the opposite speed relative to distance from the start
        ballVelocityX = (mouseX - slingshotBaseX) / 20; // Adjust the value for smoother left to right movement.
    }
});

// Start the animation loop
update();


$(document).ready(function () {
    $('#toggleDebug').click(function () {
        $('#debugDiv').toggle();
    });
    document.getElementById("version").innerHTML = version;
});