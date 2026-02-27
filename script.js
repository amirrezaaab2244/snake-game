const horizentalAreas = 35;
const verticalAreas = 25;

// اندازه هر بلاک (ریسپانسیو)
const blockSize = () => board.clientWidth / horizentalAreas;

const board = document.getElementById("board");

let gameInterval;
let snake;
let food;

class Snake {
    direction = "RIGHT";
    position = [[5, 5], [6, 5], [7, 5]];

    run(){
        const newPosition = this.getNewPosition();
        const [x, y] = newPosition;

        // برخورد با دیوار
        if (
            x < 0 ||
            x >= horizentalAreas ||
            y < 0 ||
            y >= verticalAreas
        ) {
            gameOver();
            return;
        }

        // برخورد با خودش
        const hitSelf = this.position.some(
            ([px, py]) => px === x && py === y
        );

        if (hitSelf) {
            gameOver();
            return;
        }

        // خوردن غذا
        if (x === food[0] && y === food[1]) {
            this.position.push(newPosition);
            createFood();
        } else {
            this.position.shift();
            this.position.push(newPosition);
        }

        draw();
    }

    getNewPosition(){
        const [x, y] = this.position[this.position.length - 1];

        switch (this.direction) {
            case "LEFT": return [x - 1, y];
            case "RIGHT": return [x + 1, y];
            case "UP": return [x, y - 1];
            case "DOWN": return [x, y + 1];
        }
    }

    changeDirection(newDirection){
        const opposite = {
            LEFT: "RIGHT",
            RIGHT: "LEFT",
            UP: "DOWN",
            DOWN: "UP"
        };

        if (opposite[this.direction] !== newDirection) {
            this.direction = newDirection;
        }
    }
}

function createFood(){
    food = [
        Math.floor(Math.random() * horizentalAreas),
        Math.floor(Math.random() * verticalAreas)
    ];
}

function draw(){
    board.innerHTML = "";

    const size = blockSize();

    // رسم مار
    snake.position.forEach(([x, y], index) => {
        const part = document.createElement("div");
        part.classList.add("snake");

        // سر مار
        if (index === snake.position.length - 1) {
            part.style.borderRadius = "6px";
            part.innerHTML = "• •";
            part.style.display = "flex";
            part.style.alignItems = "center";
            part.style.justifyContent = "center";
            part.style.color = "white";
            part.style.fontSize = "10px";
        }

        part.style.left = x * size + "px";
        part.style.top = y * size + "px";
        part.style.width = size + "px";
        part.style.height = size + "px";

        board.appendChild(part);
    });

    // رسم غذا
    const goal = document.createElement("div");
    goal.classList.add("goal");

    goal.style.left = food[0] * size + "px";
    goal.style.top = food[1] * size + "px";
    goal.style.width = size + "px";
    goal.style.height = size + "px";

    board.appendChild(goal);
}

function gameOver(){
    clearInterval(gameInterval);
    alert("Game Over");
}

function startGame(){
    snake = new Snake();
    createFood();
    draw();

    clearInterval(gameInterval);
    gameInterval = setInterval(() => snake.run(), 150);
}

// ================= کنترل کیبورد =================
document.addEventListener("keydown", (e) => {
    if (!snake) return;

    switch (e.key) {
        case "ArrowLeft": snake.changeDirection("LEFT"); break;
        case "ArrowRight": snake.changeDirection("RIGHT"); break;
        case "ArrowUp": snake.changeDirection("UP"); break;
        case "ArrowDown": snake.changeDirection("DOWN"); break;
    }
});

// ================= دکمه شروع دوباره =================
const restartBtn = document.createElement("button");
restartBtn.textContent = "شروع دوباره";
restartBtn.classList.add("restart-btn");
restartBtn.onclick = startGame;

document.body.appendChild(restartBtn);


// شروع بازی اول
startGame();
// ================= کنترل لمسی (Swipe) =================

let touchStartX = 0;
let touchStartY = 0;

board.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

board.addEventListener("touchend", (e) => {
    if (!snake) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // حرکت افقی
        if (diffX > 0) {
            snake.changeDirection("RIGHT");
        } else {
            snake.changeDirection("LEFT");
        }
    } else {
        // حرکت عمودی
        if (diffY > 0) {
            snake.changeDirection("DOWN");
        } else {
            snake.changeDirection("UP");
        }
    }
});
