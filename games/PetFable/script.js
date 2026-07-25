/* ============================================================
   PET FABLE
   Hatch a dragon egg, then look after the dragon.

   The numbers you are most likely to want to change are all here at
   the top. Everything below just uses them.
   ============================================================ */

const TAPS_TO_HATCH = 4;      // how many taps crack the egg open

// How fast each bar drops, per second, while you are watching.
const DROP_PER_SECOND = {
    hunger: 0.16,
    happy:  0.13,
    energy: 0.09
};

// What each button does. Minus numbers make a bar go down.
const FEED  = { hunger: +30, happy:  +4, energy:  +5 };
const PLAY  = { hunger:  -9, happy: +26, energy: -14 };
const SLEEP_ENERGY_PER_SECOND = 1.1;   // how fast energy refills while asleep

// A bar never falls below this while you are away, so coming back after a
// week is sad but not hopeless.
const AWAY_FLOOR = 15;

/* Lydia is purple. To change her colors, edit these three.
   `main` is the body, `accent` is the wings, horns and feet, and
   `belly` is the tummy and snout. */
const DRAGON_COLORS = {
    main:   '#c77dff',
    accent: '#9d4edd',
    belly:  '#f3d9ff'
};

const DEFAULT_NAME = 'Lydia';

/* Lydia's four places. Where she is changes what things do, so the rooms
   are part of the game rather than just scenery.
     playHappy  - how much extra happiness playing gives here
     playEnergy - how much extra energy playing costs here
     sleepRate  - how fast she rests here                              */
const ROOMS = {
    house:   { label: 'Home',       playHappy: 1.0, playEnergy: 1.0, sleepRate: 1.0,
               arrive: 'Home sweet home! 💜' },
    bedroom: { label: 'Bedroom',    playHappy: 0.7, playEnergy: 0.8, sleepRate: 2.2,
               arrive: 'My cosy bed! I sleep so well in here. 🛏️' },
    pool:    { label: 'Pool',       playHappy: 1.5, playEnergy: 1.3, sleepRate: 0.4,
               arrive: 'Splash! I love the pool! 🏊' },
    park:    { label: 'Water Park', playHappy: 2.0, playEnergy: 1.7, sleepRate: 0.2,
               arrive: 'THE WATER PARK! Best day ever! 🎢' },
    tramp:   { label: 'Trampoline', playHappy: 2.2, playEnergy: 2.0, sleepRate: 0.2,
               arrive: 'BOING! The trampoline park! 🤸' },
    fair:    { label: 'Fun Fair',   playHappy: 2.4, playEnergy: 1.5, sleepRate: 0.3,
               arrive: 'Cotton candy AND a roller coaster! 🎡' },

    // The stage puts on shows, but Lydia can still eat and nap here.
    // Looking after her comes first, wherever she happens to be.
    show:    { label: 'Shows',      playHappy: 2.6, playEnergy: 1.4, sleepRate: 0.6,
               arrive: 'The stage! Karaoke, magic or a bird show? 🎭' }
};

/* Extra things Lydia can do, but only in certain places. Each one says what
   it does to her three bars. Adding a new activity anywhere is one line.
     happy / energy / hunger - how much each bar moves, minus means down  */
const EXTRAS = {
    pool: [
        { icon: '🤿', label: 'Dive', happy: 20, energy: -12, hunger: -5,
          says: ['CANNONBALL! 💦', 'Watch my dive! 🤿', 'Ten out of ten! 🏅'] },

        { icon: '🥥', label: 'Coconut', happy: 12, energy: 14, hunger: 10,
          says: ['Fresh coconut water! 🥥', 'So refreshing! 🥥'] },

        { icon: '🥤', label: 'Smoothie', happy: 16, energy: 12, hunger: 16,
          says: ['Mango smoothie! Yum! 🥤', 'Brain freeze! 🥶'] },

        { icon: '♨️', label: 'Hot Tub', happy: 22, energy: 20, hunger: -4,
          says: ['Ahhh, bubbles... ♨️', 'So warm and cosy! 🫧', 'This is the life. ♨️'] },

        // Free, because Lydia is famous and the shop never charges her.
        // Give anything a `cost` and it needs coins instead.
        { icon: '🍦', label: 'Ice Cream', happy: 26, energy: 8, hunger: 18,
          says: ['ICE CREAM! 🍦', 'Mmm, strawberry! 🍓',
                 'The shop knows me, so it\'s free! 🌟'] }
    ],

    park: [
        { icon: '🤸', label: 'Water Tramp', happy: 24, energy: -16, hunger: -6,
          says: ['BOING into the water! 💦', 'Double bounce! 🤸',
                 'The wet trampoline is the best one! 💧'] },

        { icon: '🤽', label: 'Diving Board', happy: 22, energy: -12, hunger: -5,
          says: ['Bouncy bouncy... SPLASH! 🤽', 'Belly flop! 😂',
                 'A perfect ten! 🏅'] },

        { icon: '🎢', label: 'Water Coaster', happy: 28, energy: -18, hunger: -8,
          says: ['WHOOOOSH! 🎢', 'Hands in the air! 🙌',
                 'That drop was HUGE! 💦'] },

        { icon: '🛟', label: 'Lazy River', happy: 14, energy: 10, hunger: -3,
          says: ['Just floating along... 🛟', 'So peaceful. 😌'] },

        { icon: '🎡', label: 'Water Wheel', happy: 25, energy: -10, hunger: -5,
          says: ['Round and round over the water! 🎡',
                 'I can see the whole park from up here! 👀',
                 'It dunks you at the bottom! 💦'] },

        { icon: '🌊', label: 'Wave Pool', happy: 26, energy: -14, hunger: -6,
          says: ['Here comes a BIG one! 🌊', 'The wave machine! 🌊',
                 'That wave was taller than me! 😲'] },

        { icon: '🏄', label: 'Surfing', happy: 30, energy: -20, hunger: -8,
          says: ['Surf\'s UP! 🏄', 'Look, no hands! 🤙',
                 'I rode it all the way in! 🌊', 'Cowabunga! 🏄'] },

        { icon: '🏊', label: 'Big Pool', happy: 18, energy: -8, hunger: -4,
          says: ['Splashing in the big pool! 🏊', 'Race you to the end! 💦',
                 'I can do a handstand underwater! 🤸'] }
    ]
};

// How many coins Lydia earns for doing things. Shows pay best, because a
// crowd is watching.
const COINS_PER_PLAY = 1;
const COINS_PER_SHOW = 3;

// The stage puts on a different kind of show each time. Each one has its
// own emoji and its own things to shout.
const SHOWS = [
    { emoji: '🎤', lines: ['🎤 KARAOKE! La la laaaa!',
                           '🎤 This next song is for you!',
                           '🎤 Everybody sing along!'] },
    { emoji: '🎩', lines: ['🎩 For my next trick... abracadabra!',
                           '🎩 Is THIS your card?',
                           '🎩 Nothing up my sleeves! ✨'] },
    { emoji: '🦜', lines: ['🦜 Presenting... the bird show!',
                           '🦜 Look how high they fly!',
                           '🕊️ And now, the doves!'] }
];


/* ---------- Pieces of the page ---------- */

const eggScreen  = document.getElementById('egg-screen');
const nameScreen = document.getElementById('name-screen');
const petScreen  = document.getElementById('pet-screen');

const egg        = document.getElementById('egg');
const eggHint    = document.getElementById('egg-hint');
const cracks     = document.querySelectorAll('.crack');

const nameDragon = document.getElementById('name-dragon');
const nameInput  = document.getElementById('name-input');
const nameBtn    = document.getElementById('name-btn');
const nameWarning= document.getElementById('name-warning');

const petDragonEl= document.getElementById('pet-dragon');
const petNameEl  = document.getElementById('pet-name');
const speechEl   = document.getElementById('speech');
const zzzEl      = document.getElementById('zzz');
const floatiesEl = document.getElementById('floaties');

const barEls = {
    hunger: document.getElementById('bar-hunger'),
    happy:  document.getElementById('bar-happy'),
    energy: document.getElementById('bar-energy')
};

const feedBtn  = document.getElementById('feed-btn');
const playBtn  = document.getElementById('play-btn');
const sleepBtn = document.getElementById('sleep-btn');
const resetBtn = document.getElementById('reset-btn');

const coinsEl    = document.getElementById('coins');
const prizesEl   = document.getElementById('prizes');
const extrasEl   = document.getElementById('extras');
const stage      = document.getElementById('stage');
const doorEl     = document.getElementById('door');
const roomEls    = document.querySelectorAll('.room');
const roomBtns   = document.querySelectorAll('.room-btn');


/* ---------- Everything the game remembers ---------- */

// One object holding the whole pet. Keeping it in a single place means
// saving the game is just "write this one thing down".
let pet = null;
let taps = 0;
let speechTimer = null;

function blankPet(name) {
    return {
        name:      name,
        hunger:    80,
        happy:     80,
        energy:    80,
        asleep:    false,
        room:      'house',
        coins:     10,      // pocket money to start with
        prizes:    0,
        lastSeen:  Date.now()   // used to work out how long you were away
    };
}

function save() {
    pet.lastSeen = Date.now();
    localStorage.setItem('petFable', JSON.stringify(pet));
}

function load() {
    const saved = localStorage.getItem('petFable');
    if (!saved) return null;

    // If the saved text is damaged somehow, start fresh instead of crashing.
    try {
        return JSON.parse(saved);
    } catch (e) {
        return null;
    }
}


/* ---------- Drawing the dragon ---------- */

// The dragon is built from plain divs, one per body part. This returns the
// markup so the same dragon can appear on the naming screen and the main
// screen without writing it out twice.
function dragonHTML() {
    return `
        <div class="dragon">
            <div class="wing wing-l"></div>
            <div class="wing wing-r"></div>
            <div class="tail"><div class="tail-tip"></div></div>
            <div class="body"><div class="belly"></div></div>
            <div class="foot foot-l"></div>
            <div class="foot foot-r"></div>
            <div class="head">
                <div class="horn horn-l"></div>
                <div class="horn horn-r"></div>
                <div class="d-eye d-eye-l"></div>
                <div class="d-eye d-eye-r"></div>
                <div class="d-blush d-blush-l"></div>
                <div class="d-blush d-blush-r"></div>
                <div class="snout"></div>
                <div class="mouth"></div>
            </div>
        </div>`;
}

function applyColors() {
    const root = document.documentElement.style;
    root.setProperty('--dragon-main',   DRAGON_COLORS.main);
    root.setProperty('--dragon-accent', DRAGON_COLORS.accent);
    root.setProperty('--dragon-belly',  DRAGON_COLORS.belly);
}


/* ---------- Hatching ---------- */

egg.addEventListener('click', () => {
    taps++;

    // Restarting a CSS animation needs the class removed and re-added, and
    // the browser only notices if you force it to redraw in between.
    egg.classList.remove('tapped');
    void egg.offsetWidth;
    egg.classList.add('tapped');

    if (taps <= cracks.length) {
        cracks[taps - 1].classList.add('show');
    }

    const messages = [
        'It moved!',
        'Something is pushing...',
        'Almost there!',
        'Here it comes!'
    ];
    eggHint.textContent = messages[Math.min(taps - 1, messages.length - 1)];

    if (taps >= TAPS_TO_HATCH) hatch();
});

function hatch() {
    confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });

    applyColors();
    nameDragon.innerHTML = dragonHTML();

    nameInput.value = DEFAULT_NAME;   // already filled in, ready to change

    eggScreen.classList.remove('active');
    nameScreen.classList.add('active');
}

nameBtn.addEventListener('click', () => {
    const typed = nameInput.value.trim();

    if (typed === '') {
        nameWarning.classList.remove('hidden');
        return;
    }

    nameWarning.classList.add('hidden');
    pet = blankPet(typed);
    save();
    startCaring();
});

// Pressing Enter in the box does the same as clicking the button.
nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') nameBtn.click();
});


/* ---------- Looking after the dragon ---------- */

function startCaring() {
    applyColors();
    petDragonEl.innerHTML = dragonHTML();
    petNameEl.textContent = pet.name;

    nameScreen.classList.remove('active');
    eggScreen.classList.remove('active');
    petScreen.classList.add('active');

    // Older saved dragons were made before the rooms existed, so give any
    // of those a room rather than letting the game break.
    if (!ROOMS[pet.room]) pet.room = 'house';
    goToRoom(pet.room);

    render();
    say(`Hi! I'm ${pet.name}!`);
}

// Keeps a number between 0 and 100, so a bar can never overflow or go
// negative no matter what happens to it.
function clamp(n) {
    return Math.max(0, Math.min(100, n));
}

function render() {
    for (const key of ['hunger', 'happy', 'energy']) {
        const value = pet[key];
        const bar = barEls[key];

        bar.style.width = value + '%';
        bar.classList.toggle('warn',   value < 50 && value >= 25);
        bar.classList.toggle('danger', value < 25);
    }

    const dragon = petDragonEl.querySelector('.dragon');
    if (dragon) dragon.className = 'dragon ' + mood();

    zzzEl.classList.toggle('hidden', !pet.asleep);

    coinsEl.textContent  = '🪙 ' + (pet.coins  || 0);
    prizesEl.textContent = '🧸 ' + (pet.prizes || 0);

    // Grey out anything Lydia cannot afford right now.
    document.querySelectorAll('.extra-btn .price').forEach(price => {
        const cost = Number(price.textContent.replace(/\D/g, ''));
        price.closest('.extra-btn').classList.toggle('broke', (pet.coins || 0) < cost);
    });

    // While asleep the dragon cannot eat or play, so those buttons switch off
    // rather than silently doing nothing. Feeding and sleeping work in every
    // room, so Lydia can always be looked after.
    feedBtn.disabled  = pet.asleep;
    sleepBtn.disabled = false;
    playBtn.disabled  = pet.asleep || pet.energy < 12;

    sleepBtn.innerHTML = pet.asleep
        ? '☀️<span>Wake up</span>'
        : '😴<span>Sleep</span>';

    // The Play button is called something different depending on where she is.
    const PLAY_LABEL = {
        house: '🎾<span>Play</span>',
        bedroom: '🎾<span>Play</span>',
        pool: '🏊<span>Swim</span>',
        park: '🎢<span>Water Slide</span>',
        tramp: '🤸<span>Bounce</span>',
        fair: '🎈<span>Pop</span>',
        show: '🎤<span>Perform</span>'
    };
    playBtn.innerHTML = PLAY_LABEL[pet.room];
}

// Whichever need is worst decides how the dragon looks. Checking sleep
// first means a sleeping dragon always looks asleep.
function mood() {
    if (pet.asleep) return 'sleepy';
    if (pet.hunger < 30) return 'hungry';
    if (pet.happy  < 30 || pet.energy < 20) return 'sad';
    return 'happy';
}

function say(text, holdFor = 3200) {
    speechEl.textContent = text;
    speechEl.classList.add('show');

    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => speechEl.classList.remove('show'), holdFor);
}

function floaty(emoji) {
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = emoji;
    el.style.left = (30 + Math.random() * 40) + '%';
    floatiesEl.appendChild(el);

    // Tidy up after the animation, or thousands of dead emoji pile up in
    // the page over a long session.
    setTimeout(() => el.remove(), 1200);
}


/* ---------- Moving between rooms ---------- */

function goToRoom(name) {
    if (!ROOMS[name]) return;

    pet.room = name;

    // Show only the room she is in, and move her to the right spot in it.
    roomEls.forEach(el => el.classList.toggle('active', el.classList.contains('room-' + name)));
    stage.className = 'stage-' + name;
    roomBtns.forEach(b => b.classList.toggle('here', b.dataset.room === name));

    buildExtras();
    save();
    render();
}

// Builds the extra buttons for whichever room Lydia is in. Called only when
// she moves, not every second, because rebuilding buttons under a finger
// that is about to tap them would be annoying.
function buildExtras() {
    extrasEl.innerHTML = '';

    const list = EXTRAS[pet.room];
    if (!list) return;   // this room has no extras, so the row stays empty

    for (const thing of list) {
        const btn = document.createElement('button');
        btn.className = 'extra-btn';

        // Anything you have to pay for shows its price on the button.
        btn.innerHTML = thing.cost
            ? `${thing.icon}<span>${thing.label}</span><span class="price">🪙${thing.cost}</span>`
            : `${thing.icon}<span>${thing.label}</span>`;

        btn.addEventListener('click', () => {
            if (pet.asleep) {
                say('Shhh, I\'m sleeping... 💤');
                return;
            }

            // Anything with a price has to be paid for first.
            if (thing.cost) {
                if (pet.coins < thing.cost) {
                    say(`That costs ${thing.cost} 🪙 and I only have ${pet.coins}. Let's go earn some!`, 4500);
                    return;
                }
                pet.coins -= thing.cost;
                floaty('🪙');
            }

            pet.happy  = clamp(pet.happy  + thing.happy);
            pet.energy = clamp(pet.energy + thing.energy);
            pet.hunger = clamp(pet.hunger + thing.hunger);

            floaty(thing.icon);
            say(thing.says[Math.floor(Math.random() * thing.says.length)]);
            save();
            render();
        });

        extrasEl.appendChild(btn);
    }
}

roomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (pet.room === btn.dataset.room) return;   // already there
        goToRoom(btn.dataset.room);
        say(ROOMS[btn.dataset.room].arrive);
    });
});

// The front door goes inside to the bedroom.
doorEl.addEventListener('click', () => {
    goToRoom('bedroom');
    say('Come inside! 🚪');
});


/* ---------- The buttons ---------- */

// What Lydia gets fed. Pizza and hot dogs come up most often because they
// are listed twice, which is a simple way to make something more likely.
const FOODS = ['🍕', '🌭', '🍕', '🌭', '🍔', '🍟', '🍖', '🍓', '🧁', '🍎'];

feedBtn.addEventListener('click', () => {
    if (pet.hunger > 92) {
        say("I'm too full! 🤢");
        return;
    }

    pet.hunger = clamp(pet.hunger + FEED.hunger);
    pet.happy  = clamp(pet.happy  + FEED.happy);
    pet.energy = clamp(pet.energy + FEED.energy);

    floaty(FOODS[Math.floor(Math.random() * FOODS.length)]);
    say('Yum yum! 😋');
    save();
    render();
});

playBtn.addEventListener('click', () => {
    if (pet.energy < 12) {
        say("I'm too tired to play... 😪");
        return;
    }

    // Where she is decides how good playing is. The water park is the most
    // fun by far, but it wears her out the fastest too.
    const here = ROOMS[pet.room];

    pet.happy  = clamp(pet.happy  + PLAY.happy  * here.playHappy);
    pet.hunger = clamp(pet.hunger + PLAY.hunger);
    pet.energy = clamp(pet.energy + PLAY.energy * here.playEnergy);

    const cheers = {
        house:   ['Wheee! That was fun! 🎾', 'Racing up the driveway! 🛴'],
        bedroom: ['Bouncing on the bed! 🛏️'],
        pool:    ['SPLASH! 💦', 'Watch me dive! 🏊'],
        park:    ['WHOOOSH! Down the slide! 🎢', 'Again! Again! 💦'],
        tramp:   ['BOING! BOING! 🤸', 'I can touch the sky! ⭐', 'Backflip! 🌟'],
        fair:    ['POP! Got one! 🎈', 'Round and round! 🎡', 'Cotton candy! 🍭'],
        show:    ['Ta-daaa! 🎤', 'Everybody clap! 👏', 'For my next trick... 🎭']
    }[pet.room];

    // Each place throws up its own little emoji when she plays.
    const PARTICLE = {
        house: '💖', bedroom: '💖', pool: '💦',
        park: '💦', tramp: '⭐', fair: '🎈', show: '🎵'
    };
    floaty(PARTICLE[pet.room]);

    // On the stage, pick one of the three kinds of show at random. Lydia is
    // famous, so a crowd turns up and pays her.
    if (pet.room === 'show') {
        const act = SHOWS[Math.floor(Math.random() * SHOWS.length)];
        pet.coins = (pet.coins || 0) + COINS_PER_SHOW;

        floaty(act.emoji);
        floaty('🪙');
        say(act.lines[Math.floor(Math.random() * act.lines.length)] +
            ` +${COINS_PER_SHOW}🪙`, 4000);
        save();
        render();
        return;
    }

    // Everything else earns a little pocket money too.
    pet.coins = (pet.coins || 0) + COINS_PER_PLAY;

    // At the arcade, popping a balloon sometimes wins a teddy bear.
    if (pet.room === 'fair' && Math.random() < 0.35) {
        pet.prizes = (pet.prizes || 0) + 1;
        pet.happy = clamp(pet.happy + 8);
        floaty('🧸');
        say(`You won a teddy! 🧸 That's ${pet.prizes} now!`, 4000);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
        save();
        render();
        return;
    }
    floaty('⭐');
    say(cheers[Math.floor(Math.random() * cheers.length)]);
    save();
    render();
});

sleepBtn.addEventListener('click', () => {
    pet.asleep = !pet.asleep;
    say(pet.asleep ? 'Goodnight... 💤' : 'Good morning! ☀️');
    save();
    render();
});

resetBtn.addEventListener('click', () => {
    const sure = confirm(
        `Say goodbye to ${pet.name} and start a brand new egg?\n\n` +
        `This cannot be undone.`
    );
    if (!sure) return;

    localStorage.removeItem('petFable');
    location.reload();
});


/* ---------- Time passing ---------- */

// Runs once a second. Everything that happens on its own lives here.
setInterval(() => {
    if (!pet) return;

    if (pet.asleep) {
        // She rests more than twice as fast in the bedroom, and barely at
        // all at the water park, which is exactly how it works for people.
        pet.energy = clamp(pet.energy + SLEEP_ENERGY_PER_SECOND * ROOMS[pet.room].sleepRate);
        pet.hunger = clamp(pet.hunger - DROP_PER_SECOND.hunger * 0.5);

        // Wakes itself up once it is fully rested.
        if (pet.energy >= 100) {
            pet.asleep = false;
            say('I feel great! ☀️');
        }
    } else {
        pet.hunger = clamp(pet.hunger - DROP_PER_SECOND.hunger);
        pet.happy  = clamp(pet.happy  - DROP_PER_SECOND.happy);
        pet.energy = clamp(pet.energy - DROP_PER_SECOND.energy);
    }

    render();
}, 1000);

// Saving every second would be wasteful, so it happens every 10 instead.
setInterval(() => { if (pet) save(); }, 10000);

// Save on the way out too, so closing the tab does not lose progress.
window.addEventListener('beforeunload', () => { if (pet) save(); });


/* ---------- Catching up after you have been away ---------- */

function catchUp() {
    const secondsAway = (Date.now() - pet.lastSeen) / 1000;
    if (secondsAway < 30) return;   // barely gone, nothing to do

    // Time away counts for less than time watching, so the dragon is never
    // starving just because you went to school.
    const away = secondsAway * 0.35;

    for (const key of ['hunger', 'happy', 'energy']) {
        const dropped = pet[key] - DROP_PER_SECOND[key] * away;
        // Never push a bar below the floor, but do not raise one either.
        pet[key] = clamp(Math.max(Math.min(pet[key], AWAY_FLOOR), dropped));
    }

    const hours = Math.floor(secondsAway / 3600);
    const mins  = Math.floor(secondsAway / 60);

    if (hours >= 1) {
        say(`You were gone ${hours} hour${hours > 1 ? 's' : ''}! I missed you! 🥺`, 5000);
    } else if (mins >= 5) {
        say(`Welcome back! 💜`, 4000);
    }
}


/* ---------- Go ---------- */

const savedPet = load();

if (savedPet) {
    // There is already a dragon, so skip the egg and go straight to it.
    pet = savedPet;
    startCaring();
    catchUp();
    render();
} else {
    applyColors();
    eggScreen.classList.add('active');
}
