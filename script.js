// Existing Canvas and Context Initialization
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = window.innerHeight - 150;

// Variables
let isDragging = false;
let mouseY = 0;
let mouseX = 0;
let score = 0;

// Slingshot dimensions
const slingshotBaseX = canvas.width / 2;
const slingshotBaseY = canvas.height - 120; // Slingshot at the bottom
const ballRadius = 30;
let ballY = slingshotBaseY - 30; // Start directly at the string
let ballX = slingshotBaseX;
let ballVelocityY = 0;
let ballVelocityX = 0;
let gravity = 0.5; // Gravity force

function drawSlingshot() {
    // Draw the slingshot's Y shape
    ctx.beginPath();
    ctx.moveTo(slingshotBaseX - 50, slingshotBaseY - 35); // Base left
    ctx.lineTo(slingshotBaseX, slingshotBaseY + 40); // Bottom middle
    ctx.lineTo(slingshotBaseX + 50, slingshotBaseY - 35); // Base right
    ctx.strokeStyle = '#4d647ada';
    ctx.lineWidth = 15;
    ctx.stroke();

    // Draw the bottom line of the slingshot
    ctx.beginPath();
    ctx.moveTo(slingshotBaseX, slingshotBaseY + 40); // Straight down
    ctx.lineTo(slingshotBaseX, slingshotBaseY + 70); // Bottom middle
    ctx.strokeStyle = '#12345678';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw the horizontal string
    ctx.beginPath();
    ctx.moveTo(slingshotBaseX - 50, slingshotBaseY - 30); // Left end of the string
    ctx.lineTo(slingshotBaseX + 50, slingshotBaseY - 30); // Right end of the string
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 10;
    ctx.stroke();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#cc8500';
    ctx.fill();
    ctx.closePath();
}

function drawUI() {
    // Reset Button
    const buttonX = 0;
    const buttonY = 0;
    const buttonWidth = 100;
    const buttonHeight = 50;
    ctx.fillStyle = '#4CAF50'; // Green color
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.strokeStyle = '#FFFFFF'; // White border
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
    ctx.fillStyle = '#FFFFFF'; // White text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Reset', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

    // Score Board
    const scoreX = 0;
    const scoreY = 50;
    const scoreWidth = 100;
    const scoreHeight = 50;
    ctx.fillStyle = '#4C5FA0'; // Blue
    ctx.fillRect(scoreX, scoreY, scoreWidth, scoreHeight);
    ctx.strokeStyle = '#FFFFFF'; // White border
    ctx.strokeRect(scoreX, scoreY, scoreWidth, scoreHeight);
    ctx.fillStyle = '#FFFFFF'; // White text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Score: ' + score, scoreX + scoreWidth / 2, scoreY + scoreHeight / 2);

    // Debug Board
    const debugX = 0;
    const debugY = 100;
    const debugWidth = 100;
    const debugHeight = 50;
    ctx.fillStyle = '#AC5Fr0'; // Red
    ctx.fillRect(debugX, debugY, debugWidth, debugHeight);
    ctx.strokeStyle = '#FFFFFF'; // White border
    ctx.strokeRect(debugX, debugY, debugWidth, debugHeight);
    ctx.fillStyle = '#FFFFFF'; // White text color
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Debug: ' + debug, debugX + debugWidth / 2, debugY + debugHeight / 2);
}

function resetGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlingshot();
    drawBall();
    drawUI();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSlingshot();
    drawBall();
    debug = ballVelocityY;
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
                    ballY = slingshotBaseY - 30; // Start directly at the string
                    ballX = slingshotBaseX;
                    ballVelocityY = 0;
                    ballVelocityX = 0;
                    score++;
                    update(); // Reset after bounce
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
        ballY = Math.min(mouseY, slingshotBaseY + 50); // Make sure the ball doesn't go off the bottom
        ballX = mouseX; // Follow X coordinate 
    }

    requestAnimationFrame(update);
}

// Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    mouseX = e.clientX - rect.left;
});

canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        const pullDistance = slingshotBaseY - mouseY;
        ballVelocityY = -pullDistance; // Higher fling
        ballVelocityX = (mouseX - slingshotBaseX) / 20; // Adjusted for smoother fling
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
        ballVelocityX = (mouseX + slingshotBaseX) / 20;
    }
});

// Start the animation loop
update();
