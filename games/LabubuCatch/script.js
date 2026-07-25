const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreEl = document.getElementById('final-score');
const popSound = document.getElementById('pop-sound');
const loseSound = document.getElementById('lose-sound');

let isPlaying = false;
let score = 0;
let lives = 5; // Starting with 5 lives so they don't die as fast!
let items = [];
let spawnInterval;
let gameLoopId;
let spawnRate = 1200; 
let fallSpeed = 3.5; 

// Emojis functioning as Labubus, Toilets, and Hazards!
const monsters = ['👹', '👾', '🚽', '🧻'];
const hazards = ['💣', '💩'];

let playerX = window.innerWidth / 2;

function updatePlayerPosition(clientX) {
    if (!isPlaying) return;
    const containerRect = gameContainer.getBoundingClientRect();
    
    let x = clientX - containerRect.left;
    
    // Clamp to boundaries
    const padding = 45; // Half of player width
    if (x < padding) x = padding;
    if (x > containerRect.width - padding) x = containerRect.width - padding;
    
    player.style.left = `${x}px`;
    playerX = x;
}

// Controls
gameContainer.addEventListener('mousemove', (e) => {
    updatePlayerPosition(e.clientX);
});

gameContainer.addEventListener('touchmove', (e) => {
    updatePlayerPosition(e.touches[0].clientX);
}, { passive: true });

function spawnItem() {
    if (!isPlaying) return;
    
    const containerRect = gameContainer.getBoundingClientRect();
    const rand = Math.random();
    
    let type = 'monster';
    let emoji = '';
    
    if (rand < 0.10) {
        // 10% chance for Toilet Labubu bonus
        type = 'bonus';
    } else if (rand < 0.35) {
        // 25% chance of hazard
        type = 'bomb';
        emoji = hazards[Math.floor(Math.random() * hazards.length)];
    } else {
        type = 'monster';
        emoji = monsters[Math.floor(Math.random() * monsters.length)];
    }
    
    const itemEl = document.createElement('div');
    if (type === 'bonus') {
        itemEl.classList.add('item', 'item-toilet-labubu');
    } else {
        itemEl.classList.add('item', `item-${type}`);
        itemEl.innerText = emoji;
    }
    
    const startX = Math.random() * (containerRect.width - 80) + 40;
    let top = -80;
    itemEl.style.left = `${startX}px`;
    itemEl.style.top = `${top}px`;
    
    gameArea.appendChild(itemEl);
    
    items.push({
        el: itemEl,
        x: startX,
        y: top,
        width: type === 'bonus' ? 80 : 70,
        height: type === 'bonus' ? 80 : 70,
        type: type
    });
    
    // speed up spawn slightly over time
    if (spawnRate > 400) {
        spawnRate -= 15; 
        clearInterval(spawnInterval);
        spawnInterval = setInterval(spawnItem, spawnRate);
    }
}

function createPopEffect(x, y, text, color) {
    const pop = document.createElement('div');
    pop.classList.add('pop-animation');
    pop.innerText = text;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    if (color) {
        pop.style.color = color;
    }
    gameArea.appendChild(pop);
    
    setTimeout(() => {
        if (pop.parentNode) pop.parentNode.removeChild(pop);
    }, 700);
}

function updateGame() {
    if (!isPlaying) return;
    
    const containerRect = gameContainer.getBoundingClientRect();
    const containerHeight = containerRect.height;
    
    // Collision box for player (slightly smaller than visual size to feel fair)
    const pTop = containerHeight - 90; 
    const pLeft = playerX - 35;
    const pRight = playerX + 35;
    const pBottom = containerHeight - 10;

    const currentSpeed = fallSpeed + (score * 0.08); // accelerates based on score

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        item.y += currentSpeed;
        item.el.style.top = `${item.y}px`;
        
        // Item collision bounding box
        const iLeft = item.x - 35; 
        const iRight = item.x + 35;
        const iTop = item.y - 35;
        const iBottom = item.y + 35;
        
        const isColliding = pLeft < iRight && 
                            pRight > iLeft && 
                            pTop < iBottom && 
                            pBottom > iTop;
                            
        if (isColliding) {
            if (item.type === 'monster' || item.type === 'bonus') {
                let points = item.type === 'bonus' ? 5 : 1;
                score += points;
                scoreEl.innerText = score;
                createPopEffect(item.x, item.y, `+${points}`, item.type === 'bonus' ? '#ff00ff' : null);
                
                try {
                    confetti({
                        particleCount: 20,
                        spread: 60,
                        origin: { 
                            x: (item.x + 35) / window.innerWidth, 
                            y: (item.y + 35) / window.innerHeight 
                        },
                        colors: ['#ffeb3b', '#ff00ff', '#00ffff', '#ff5722'],
                        ticks: 50,
                        gravity: 1.5,
                        zIndex: 1000
                    });
                } catch(e) {}
                
                popSound.currentTime = 0;
                popSound.volume = 0.4;
                popSound.play().catch(e => {}); 
            } else {
                loseLife();
                createPopEffect(item.x, item.y, 'OUCH!', '#ff3333');
                
                // Funny high pitch voice for the kid!
                let u = new SpeechSynthesisUtterance("Ewww, poop!");
                u.pitch = 2.0;
                u.rate = 1.2;
                window.speechSynthesis.speak(u);
            }
            
            item.el.remove();
            items.splice(i, 1);
            continue;
        }
        
        // Missed item
        if (item.y > containerHeight) {
            if (item.type === 'monster' || item.type === 'bonus') {
                // NO MORE LOSING LIVES HERE! Just a harmless 'miss' note on screen.
                createPopEffect(item.x, containerHeight - 50, 'miss', '#777');
            }
            item.el.remove();
            items.splice(i, 1);
        }
        
        
    }
    
    if (isPlaying) {
        gameLoopId = requestAnimationFrame(updateGame);
    }
}

function loseLife() {
    lives--;
    updateLivesDisplay();
    
    loseSound.currentTime = 0;
    loseSound.volume = 0.5;
    loseSound.play().catch(e => {});
    
    gameContainer.style.background = 'rgba(255, 60, 60, 0.4)';
    setTimeout(() => {
        if(isPlaying) gameContainer.style.background = 'rgba(255, 255, 255, 0.2)';
    }, 200);

    if (lives <= 0) {
        endGame();
    }
}

function updateLivesDisplay() {
    let hearts = '';
    for(let i=0; i<lives; i++) {
        hearts += '❤️';
    }
    livesEl.innerText = hearts;
}

function startGame() {
    score = 0;
    lives = 5; // Starting lives back at 5
    spawnRate = 1200;
    scoreEl.innerText = score;
    updateLivesDisplay();
    gameContainer.style.background = 'rgba(255, 255, 255, 0.2)';
    
    items.forEach(item => item.el.remove());
    items = [];
    
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    
    isPlaying = true;
    
    const containerRect = gameContainer.getBoundingClientRect();
    playerX = containerRect.width / 2;
    player.style.left = `${playerX}px`;
    
    spawnInterval = setInterval(spawnItem, spawnRate);
    gameLoopId = requestAnimationFrame(updateGame);
}

function endGame() {
    isPlaying = false;
    clearInterval(spawnInterval);
    cancelAnimationFrame(gameLoopId);
    
    finalScoreEl.innerText = score;
    gameOverScreen.classList.add('active');
    
    // Announcer voice on game over
    let u = new SpeechSynthesisUtterance(`Game over! You caught ${score} Labubus!`);
    u.pitch = 1.5;
    window.speechSynthesis.speak(u);
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

window.addEventListener('resize', () => {
    if(!isPlaying) {
        const containerRect = gameContainer.getBoundingClientRect();
        playerX = containerRect.width / 2;
        player.style.left = `${playerX}px`;
    }
});
