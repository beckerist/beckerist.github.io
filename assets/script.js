// Settings you can change
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;
const slingshotBaseX = canvas.width / 2;
const slingshotBaseY = canvas.height - 150; // Slingshot at the bottom
const ballRadius = 30;
const gravity = 0.5; // Gravity force
const maxtargetX = 350; // Target area
const mintargetX = 25;
const maxtargetY = 350;
const mintargetY = 100;

// Variables that the program changes
let isDragging = false;
let mouseY = 0;
let mouseX = 0;
let score = 0;
let ballY = slingshotBaseY - 35; // Start directly at the string
let ballX = slingshotBaseX;
let ballVelocityY = 0;
let ballVelocityX = 0;
let targetX = Math.floor(Math.random() * (maxtargetX - mintargetX + 1)) + mintargetX;
let targetY = Math.floor(Math.random() * (maxtargetY - mintargetY + 1)) + mintargetY;


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
    img.src = './assets/images/hook.png';
    img.onload = function() {
        ctx.drawImage(img, ballX, ballY, 14, 22);
     };
}

function drawTarget() {
    ctx.beginPath();
    ctx.arc(targetX, targetY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#c9090999';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, ballRadius - 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffffff';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(targetX, targetY, ballRadius - 20, 0, Math.PI * 2);
    ctx.fillStyle = '#c9090999';
    ctx.fill();
    ctx.closePath();
}

function drawUI() {

    // Score Board
    const scoreX = 0;
    const scoreY = 0;
    const scoreWidth = 100;
    const scoreHeight = 50;
    ctx.fillStyle = '#4C5FA0'; // Blue
    ctx.fillRect(scoreX, scoreY, scoreWidth, scoreHeight);
    ctx.strokeStyle = '#FAFAFF'; // White border
    ctx.strokeRect(scoreX, scoreY, scoreWidth, scoreHeight);
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
    ctx.strokeRect(debugBoxX, debugBoxY, debugBoxWidth, debugBoxHeight);
    ctx.fillStyle = '#FAFAFF'; // White text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MY: ' + mouseY + ' MX: ' + mouseX + ' ' + isDragging, debugBoxX + debugBoxWidth / 2, debugBoxY + debugBoxHeight / 2);
}

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballVelocityX = 0;
    ballVelocityY = 0;
    ballY = slingshotBaseY - 35; // Start directly at the string
    ballX = slingshotBaseX;
    update();
}

function resetScore() {
    score = 0;

}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTarget();
    drawSlingshot();
    drawBall();
    drawUI();
    
    if (!isDragging) {
        if (ballVelocityY !== 0 || ballX !== slingshotBaseX) {
            ballVelocityY += gravity; // Gravity effect
            ballY += ballVelocityY; // Update Y position
            ballX -= ballVelocityX; // Update X position

            // Check for bounce on ground
            if (ballY + ballRadius >= slingshotBaseY) {
                ballY = slingshotBaseY - ballRadius; // Prevent going below ground
                ballVelocityY = -ballVelocityY * 0.6; // Bounce effect
                if (Math.abs(ballVelocityY) < 1 && ballY === slingshotBaseY - ballRadius) {
                    resetGame(); // Reset if the ball is just rolling on the platform
                }
            }

            // Check for top boundary collision
            if (ballY - ballRadius <= 0) {
                ballY = ballRadius; // Prevent going out of bounds at the top
                ballVelocityY = -ballVelocityY * 0.8; // Bounce off the top edge
            }

            // Check for left and right boundary collisions
            if (ballX + ballRadius >= canvas.width) {
                ballX = canvas.width - ballRadius; // Prevent going out of bounds on the right
                ballVelocityX = -ballVelocityX * 0.8; // Bounce off the right edge
            } else if (ballX - ballRadius <= 0) {
                ballX = ballRadius; // Prevent going out of bounds on the left
                ballVelocityX = -ballVelocityX * 0.8; // Bounce off the left edge
            }
        }
    } else {
        //ballY = Math.max(mouseY, slingshotBaseY - 35); // Make sure the ball doesn't go above the slingshot when pulling
        ballY = mouseY; // Make sure the ball doesn't go above the slingshot when pulling
        ballX = mouseX; // Follow that mouse!
    }
    requestAnimationFrame(update);
}

// Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
    if (mouseY < 60) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
        mouseX = e.clientX - rect.left;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        ballVelocityY = (mouseY - slingshotBaseY) * 2; // Fling back in the opposite speed relative to distance from the start
        ballVelocityX = (mouseX - slingshotBaseX) / 20; // Adjust the value for smoother left to right movement.
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
        const pullDistance = slingshotBaseY - mouseY;
        ballVelocityY = -pullDistance;
        debugBox = ballVelocityY;
        ballVelocityX = (mouseX + slingshotBaseX) / 20;
    }
});

// Start the animation loop
update();
