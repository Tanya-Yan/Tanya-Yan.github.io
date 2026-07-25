/* ============================================================
   SNAKE

   Want to change how the game feels? Change these five numbers.
   Everything else adjusts by itself.
   ============================================================ */

const GRID_SIZE    = 20;   // board is 20 squares across and 20 down
const SPEED_UP     = 2;    // milliseconds shaved off per food eaten
const START_LENGTH = 3;    // how many squares long the snake begins

// The three speeds the player can choose from. `start` is how many
// milliseconds pass between moves at the beginning, and `fastest` is the
// speed limit it can never go past. Bigger numbers mean a slower snake.
//
// Want a fourth speed? Add a line here, then add a matching button in
// index.html with the same word in its data-speed. Nothing else to change.
const SPEEDS = {
    chill:  { start: 300, fastest: 240 },
    normal: { start: 220, fastest: 155 },
    speedy: { start: 140, fastest:  85 }
};

// The food changes every single time, so the board never looks the same
// twice. Add or remove any emoji you like here and the game just uses it.
// Vegetables, fruit, and salad, because this snake eats properly.
const HEALTHY_FOODS = [
    '🥦',   // broccoli
    '🥗',   // salad
    '🍓',   // strawberry
    '🥕',   // carrot
    '🍎',   // apple
    '🍇',   // grapes
    '🫐',   // blueberries
    '🥝',   // kiwi
    '🍊',   // orange
    '🍐',   // pear
    '🥬',   // leafy greens
    '🍉'    // watermelon
];


/* ---------- Grabbing the pieces of the page ---------- */

const gameArea       = document.getElementById('game-area');
const scoreEl        = document.getElementById('score');
const bestEl         = document.getElementById('best');
const finalScoreEl   = document.getElementById('final-score');
const startScreen    = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverReason = document.getElementById('game-over-reason');
const newBestEl      = document.getElementById('new-best');
const restartBtn     = document.getElementById('restart-btn');
const changeSpeedBtn = document.getElementById('change-speed-btn');
const speedButtons   = document.querySelectorAll('.speed-btn');


/* ---------- The game's memory ---------- */

let cells = [];          // every square on the board, so we can recolor them
let snake = [];          // the snake, as a list of {x, y} spots. snake[0] is the head.
let food = null;         // where the apple is, as {x, y}
let direction = null;    // the way the snake is moving right now
let nextDirection = null;// the way the player just asked to go
let score = 0;
let speed = 0;           // the current gap between moves, which shrinks as you eat
let isPlaying = false;
let timerId = null;

// Which of the three speeds is picked. Saved, so the game remembers your
// choice next time you visit.
let chosenSpeed = localStorage.getItem('snakeSpeed') || 'normal';
if (!SPEEDS[chosenSpeed]) chosenSpeed = 'normal';   // in case of an old saved value

// localStorage remembers things even after the browser closes, which is
// how the best score survives until tomorrow.
let best = Number(localStorage.getItem('snakeBest')) || 0;
bestEl.textContent = best;


/* ---------- Building the board ---------- */

// Make GRID_SIZE x GRID_SIZE squares once, at the very start. Every square
// keeps its place in the `cells` list forever, and the game just changes
// their colors. Building them fresh every move would be slow.
function buildBoard() {
    gameArea.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    gameArea.style.gridTemplateRows    = `repeat(${GRID_SIZE}, 1fr)`;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameArea.appendChild(cell);
        cells.push(cell);
    }
}

// The board is really one long list of squares, not a real square shape.
// This turns an (x, y) spot into a position in that list.
// Row y starts at position y * GRID_SIZE, then we count x squares across.
function indexOf(x, y) {
    return y * GRID_SIZE + x;
}


/* ---------- Drawing ---------- */

// Which way the head is pointing, as a word. The eyes need this so they
// can look where the snake is going.
function facing() {
    if (!direction) return 'right';
    if (direction.x === 1)  return 'right';
    if (direction.x === -1) return 'left';
    if (direction.y === 1)  return 'down';
    return 'up';
}

function draw() {
    // Wipe the board clean first, then paint what should be there now.
    for (const cell of cells) {
        cell.className = 'cell';
        cell.innerHTML = '';
        cell.style.background = '';   // clears the rainbow from last time
    }

    snake.forEach((part, i) => {
        const cell = cells[indexOf(part.x, part.y)];

        if (i === 0) {
            // The head is a real face: two eyes and a forked tongue, turned
            // to point the way the snake is travelling.
            cell.classList.add('head', 'dir-' + facing());
            cell.innerHTML =
                '<div class="face">' +
                    '<span class="blush blush-a"></span>' +
                    '<span class="blush blush-b"></span>' +
                    '<span class="eye eye-a"></span>' +
                    '<span class="eye eye-b"></span>' +
                    '<span class="smile"></span>' +
                '</div>';
        } else {
            cell.classList.add('snake');

            // Every segment gets its own color, stepping around the color
            // wheel. hsl() takes an angle from 0 to 359: 0 is red, 120 is
            // green, 240 is blue. Longer snake means more of the rainbow.
            // The high lightness (76%) is what keeps the colors pastel and
            // soft rather than loud.
            const hue = (110 + i * 9) % 360;
            cell.style.background = `hsl(${hue}, 90%, 76%)`;
        }
    });

    if (food) {
        const cell = cells[indexOf(food.x, food.y)];
        cell.classList.add('food');
        cell.textContent = food.emoji;
    }
}


/* ---------- The apple ---------- */

// Pass an emoji to force a particular food. Called with no emoji, it picks
// a random one from HEALTHY_FOODS.
function placeFood(forcedEmoji) {
    // Collect every square the snake is NOT sitting on, then pick one of
    // those. Picking at random and retrying would work too, but it gets
    // slow once a long snake covers most of the board.
    const freeSpots = [];

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const taken = snake.some(part => part.x === x && part.y === y);
            if (!taken) freeSpots.push({ x, y });
        }
    }

    if (freeSpots.length === 0) {
        food = null;   // no room left, which means the board is full
        return;
    }

    const spot  = freeSpots[Math.floor(Math.random() * freeSpots.length)];
    const emoji = forcedEmoji ||
        HEALTHY_FOODS[Math.floor(Math.random() * HEALTHY_FOODS.length)];

    food = { x: spot.x, y: spot.y, emoji };
}


/* ---------- One step of the game ---------- */

function step() {
    // Only change direction here, once per move. If we turned the instant a
    // key was pressed, you could tap up then left faster than one step and
    // fold the snake straight back into itself.
    if (nextDirection) direction = nextDirection;

    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Did it hit a wall?
    if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE) {
        return gameOver('You hit the wall!');
    }

    // Did it bite itself? The last segment is ignored because it is about
    // to move out of the way anyway, so following your own tail is legal.
    const bitSelf = snake.some((part, i) =>
        i < snake.length - 1 && part.x === newHead.x && part.y === newHead.y
    );
    if (bitSelf) {
        return gameOver('You bit your own tail!');
    }

    /* THE CLEVER BIT.
       A snake does not really slither. To move it one square, add a new head
       at the front and remove the last piece from the back. Everything in
       between stays exactly where it was.
       To grow, skip removing the tail. That is the whole trick. */
    snake.unshift(newHead);

    const ateFood = food && newHead.x === food.x && newHead.y === food.y;

    if (ateFood) {
        score++;
        scoreEl.textContent = score;

        // Speed up a little, but never past the limit for the chosen speed.
        speed = Math.max(SPEEDS[chosenSpeed].fastest, speed - SPEED_UP);

        placeFood();

        if (!food) return win();
    } else {
        snake.pop();   // no apple, so the tail moves up
    }

    draw();

    // Book the next step. setTimeout is used instead of setInterval so the
    // gap can shrink as the snake speeds up.
    timerId = setTimeout(step, speed);
}


/* ---------- Starting, losing, winning ---------- */

function startGame() {
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    newBestEl.classList.add('hidden');

    // Build the starting snake in the middle, lying flat, facing right.
    snake = [];
    const midY = Math.floor(GRID_SIZE / 2);
    const midX = Math.floor(GRID_SIZE / 2);
    for (let i = 0; i < START_LENGTH; i++) {
        snake.push({ x: midX - i, y: midY });
    }

    direction     = { x: 1, y: 0 };   // heading right
    nextDirection = null;
    score = 0;
    speed = SPEEDS[chosenSpeed].start;
    isPlaying = true;
    scoreEl.textContent = '0';

    placeFood('🥦');   // every game starts with broccoli, because Tanya said so
    draw();

    clearTimeout(timerId);
    timerId = setTimeout(step, speed);
}

function gameOver(reason) {
    isPlaying = false;
    clearTimeout(timerId);

    gameOverReason.textContent = reason;
    finalScoreEl.textContent = score;

    if (score > best) {
        best = score;
        localStorage.setItem('snakeBest', best);
        bestEl.textContent = best;
        newBestEl.classList.remove('hidden');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    gameOverScreen.classList.add('active');
}

function win() {
    isPlaying = false;
    clearTimeout(timerId);
    confetti({ particleCount: 400, spread: 160, origin: { y: 0.6 } });
    gameOverReason.textContent = 'YOU FILLED THE WHOLE BOARD! 🤯';
    finalScoreEl.textContent = score;
    gameOverScreen.classList.add('active');
}


/* ---------- Controls ---------- */

// Every direction, and the one it is not allowed to follow. A snake cannot
// spin around into itself, so up cannot become down.
const DIRECTIONS = {
    up:    { x:  0, y: -1 },
    down:  { x:  0, y:  1 },
    left:  { x: -1, y:  0 },
    right: { x:  1, y:  0 }
};

function turn(name) {
    if (!isPlaying) return;

    const wanted = DIRECTIONS[name];

    // Block a straight reverse. Adding the two directions together gives
    // zero only when they are exact opposites.
    if (direction.x + wanted.x === 0 && direction.y + wanted.y === 0) return;

    nextDirection = wanted;
}

document.addEventListener('keydown', (e) => {
    const keys = {
        ArrowUp: 'up',    w: 'up',    W: 'up',
        ArrowDown: 'down', s: 'down',  S: 'down',
        ArrowLeft: 'left', a: 'left',  A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right'
    };

    const name = keys[e.key];
    if (!name) return;

    e.preventDefault();   // stops the arrow keys from scrolling the page
    turn(name);
});

// Swiping, for phones and tablets. Remember where a finger touched down,
// then see which way it travelled furthest when it lifted.
let touchStart = null;

document.addEventListener('touchstart', (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!touchStart) return;

    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;

    // Ignore tiny movements, otherwise a normal tap counts as a swipe.
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        turn(dx > 0 ? 'right' : 'left');
    } else {
        turn(dy > 0 ? 'down' : 'up');
    }

    touchStart = null;
}, { passive: true });

// Each speed button knows its own speed from its data-speed attribute, so
// one identical piece of code handles all three.
speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        chosenSpeed = btn.dataset.speed;
        localStorage.setItem('snakeSpeed', chosenSpeed);
        markChosenSpeed();
        startGame();
    });
});

// Puts the highlight on whichever speed is currently picked.
function markChosenSpeed() {
    speedButtons.forEach(btn => {
        btn.classList.toggle('picked', btn.dataset.speed === chosenSpeed);
    });
}

restartBtn.addEventListener('click', startGame);   // same speed as last time

changeSpeedBtn.addEventListener('click', () => {
    gameOverScreen.classList.remove('active');
    startScreen.classList.add('active');
});


/* ---------- Go ---------- */

buildBoard();
markChosenSpeed();
draw();
