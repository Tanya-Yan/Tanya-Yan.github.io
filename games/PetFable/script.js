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


/* ============================================================
   THE PHONE
   Call Lydia, text her, or FaceTime her.
   ============================================================ */

const phone       = document.getElementById('phone');
const phoneBtn    = document.getElementById('phone-btn');
const phoneClose  = document.getElementById('phone-close');
const phoneBack   = document.getElementById('phone-back');
const pviews      = document.querySelectorAll('.pview');
const pvBtns      = document.querySelectorAll('.pv-btn');

const phoneAvatar = document.getElementById('phone-avatar');
const contactName = document.getElementById('contact-name');
const callAvatar  = document.getElementById('call-avatar');
const callName    = document.getElementById('call-name');
const callStatus  = document.getElementById('call-status');
const callBubble  = document.getElementById('call-bubble');
const textHeader  = document.getElementById('text-header');
const messagesEl  = document.getElementById('messages');
const textInput   = document.getElementById('text-input');
const sendBtn     = document.getElementById('send-btn');
const faceDragon  = document.getElementById('face-dragon');
const faceBubble  = document.getElementById('face-bubble');
const faceWhere   = document.getElementById('face-where');

let callTimer = null;

/* What Lydia says depends on how she is feeling, so phoning her is a real
   way to find out what she needs. Each mood has its own set of lines. */
const PHONE_LINES = {
    hungry: ['My tummy is rumbling! 🍖', 'Is it dinner time yet? 🥺',
             'I could eat a whole pizza! 🍕'],
    sad:    ['I miss you... 🥺', 'Can you come and play with me? 💔',
             'It\'s a bit boring here. 😢'],
    sleepy: ['*yawn* I\'m so sleepy... 💤', 'Zzzzz... 😴',
             'Can I have a nap? 🛏️'],
    happy:  ['Hi! I\'m having the BEST day! 💜', 'I love you! 💖',
             'Everything is great here! ✨', 'Guess what? I\'m happy! 😄']
};

// Where she is gets mentioned too, so the phone tells you something the
// screen already shows and makes her feel like she has a life.
const WHERE_LINES = {
    house:   'I\'m at home. 🏠',
    bedroom: 'I\'m in my bedroom. 🛏️',
    pool:    'I\'m at the pool! 🏊',
    park:    'I\'m at the WATER PARK! 🎢',
    tramp:   'I\'m at the trampoline park! 🤸',
    fair:    'I\'m at the fun fair! 🎡',
    show:    'I\'m on the stage! 🎤'
};

function pickLine() {
    const lines = PHONE_LINES[mood()] || PHONE_LINES.happy;
    return lines[Math.floor(Math.random() * lines.length)];
}

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/* ---------- What Lydia texts back ----------

   She reads your message looking for words she knows. The list is checked
   from the top down and the first match wins, so put the most specific
   words near the top. If nothing matches, she falls back to how she is
   feeling right now.

   This is not real understanding. She is matching words, the way a very
   simple chatbot does. But it is enough to feel like a conversation.      */

const TEXT_REPLIES = [
    /* Grown-up topics get a friendly change of subject. Anyone can visit
       this website, including little kids, so Lydia stays a baby dragon
       who wants to talk about snacks. This rule is first on purpose, so it
       is checked before anything else. */
    { words: ['boyfriend', 'girlfriend', 'sex', 'kiss', 'kissing', 'dating', 'marry',
              'married', 'crush', 'stupid', 'hate you', 'shut up'],
      say: () => [pick(['I\'m just a baby dragon, I don\'t know about that! 🐉',
                        'Let\'s talk about something else! 😄',
                        'Huh? Can we talk about snacks instead? 🍕']),
                  pick(['Wanna go to the water park? 🎢', 'Do you want to play? 🎾'])] },

    { words: ['visit me', 'come over', 'come home', 'come see me', 'come back', 'visit'],
      say: () => [pick(['I\'ll be right there! 🏃💨', 'On my way! Wait for me! 💜',
                        'YES! I\'m coming to visit! 🐉✨']),
                  pick(['Save me a snack! 🍕', 'Don\'t start playing without me! 🎾'])] },

    { words: ['friend', 'bff', 'best friend'],
      say: () => [pick(['You\'re my BEST friend! 💜', 'Best friends forever! 🤝✨'])] },

    { words: ['how are you', 'how r u', 'how do you feel', 'you ok', 'you okay', 'hows it going'],
      say: () => [pickLine(), WHERE_LINES[pet.room]] },

    { words: ['where are you', 'where r u', 'where'],
      say: () => [WHERE_LINES[pet.room], pick(['Come and find me! 🔍', 'Wish you were here! 💜'])] },

    { words: ['love you', 'love u', 'ily', '❤', '💜', '💖'],
      say: () => [pick(['I love you more! 💜💜💜', 'Awww, I love you too! 🥰',
                        'You\'re my favourite person ever! 💖'])] },

    { words: ['miss you', 'miss u'],
      say: () => [pick(['I miss you too! 🥺', 'Come home soon! 🏠💜'])] },

    { words: ['hungry', 'food', 'eat', 'dinner', 'lunch', 'snack', 'pizza', 'hot dog'],
      say: () => pet.hunger < 45
          ? [pick(['YES please, I\'m starving! 🍕', 'Feed me feed me feed me! 🍖'])]
          : [pick(['I\'m pretty full right now. 😋', 'Maybe later, I just ate! 🍽️'])] },

    { words: ['sleep', 'tired', 'nap', 'bed', 'goodnight', 'good night', 'night night'],
      say: () => pet.energy < 45
          ? [pick(['I AM sleepy... 😴', 'Can we go to my bedroom? 🛏️'])]
          : [pick(['I\'m not tired yet! 😃', 'No way, I want to play! ⚡'])] },

    { words: ['play', 'bored', 'fun', 'game'],
      say: () => [pick(['YES! Let\'s play! 🎾', 'Can we go to the water park?? 🎢',
                        'I love playing with you! 💖'])] },

    { words: ['swim', 'pool', 'water', 'surf'],
      say: () => [pick(['The pool! Let\'s goooo! 🏊', 'I\'m a really good swimmer. 💦',
                        'Can I have ice cream after? 🍦'])] },

    { words: ['cat', 'kitty', 'ragdoll'],
      say: () => [pick(['I saw your cat keychain! So cute! 🐱',
                        'Ragdoll cats are the fluffiest. 🐈',
                        'Can I meet your cat? 🥺'])] },

    { words: ['joke', 'funny', 'laugh'],
      say: () => [pick(['Why did the dragon cross the road? To get to the OTHER FIRE! 🔥😂',
                        'What do you call a dragon who sleeps all day? A DRAGGIN\'! 😴😂',
                        'Knock knock! ... Who\'s there? ... Lydia! 🐉'])] },

    { words: ['cute', 'pretty', 'beautiful', 'best', 'amazing', 'awesome', 'cool'],
      say: () => [pick(['You think so? 🥰', 'Stop it, I\'m blushing! 😊💜',
                        'You\'re the cute one! 💖'])] },

    { words: ['sorry'],
      say: () => [pick(['It\'s okay! I forgive you. 💜', 'Don\'t worry about it! 😊'])] },

    { words: ['thank', 'thx', 'ty'],
      say: () => [pick(['You\'re welcome! 💜', 'Anytime! 😊'])] },

    { words: ['bye', 'goodbye', 'see you', 'gtg', 'later'],
      say: () => [pick(['Byeee! Come back soon! 👋', 'Don\'t be gone too long! 🥺💜'])] },

    { words: ['your name', 'whats your name', 'who are you'],
      say: () => [`I'm ${pet.name}! 🐉`, 'You picked my name, remember? 💜'] },

    { words: ['my name', 'who am i'],
      say: () => [pick(['You\'re my favourite human! 💜', 'You\'re my person! 🥰'])] },

    { words: ['hi', 'hey', 'hello', 'yo', 'sup'],
      say: () => [pick([`Hi!! 💜`, 'Heyyy! 😄', 'You texted me! 🥰']),
                  WHERE_LINES[pet.room]] },

    { words: ['yes', 'yeah', 'yep', 'ok', 'okay', 'sure'],
      say: () => [pick(['Yayyy! 🎉', 'Cool! 😄', 'I knew you\'d say that! 💜'])] },

    { words: ['no', 'nope', 'nah'],
      say: () => [pick(['Awww. 🥺', 'Okay... maybe later? 💜'])] }
];

/* ---------- Questions Lydia asks you ----------

   This is what turns replying into a conversation. She asks something,
   remembers that she asked, and treats your next message as the answer.
   Then she keeps the answer forever and brings it up later.              */

const QUESTIONS = [
    { key: 'food',   ask: 'What\'s your favourite food? 🍕',
      reply: v => [`${v}?! That's my favourite too! 🤤`, 'We have such good taste. 😌'] },

    { key: 'colour', ask: 'Ooh, what\'s your favourite colour? 🎨',
      reply: v => [`${v} is SO pretty! 💜`, 'I\'m going to paint my bedroom that colour.'] },

    { key: 'yourname', ask: 'Wait... what should I call YOU? 🐉',
      reply: v => [`${v}! That's a brilliant name. 💜`, `Hi ${v}!! 🥰`] },

    { key: 'game',   ask: 'What\'s your favourite game? 🎮',
      reply: v => [`${v}? I want to play that! 🎮`, 'Will you teach me how? 🥺'] },

    { key: 'place',  ask: 'Where should we go next? 🎢',
      reply: v => [`${v}! Yes yes YES! 🙌`, 'Let\'s go right now! 🏃💨'] },

    { key: 'school', ask: 'What did you do today? 😊',
      reply: v => [`${v}? Tell me more! 👀`, 'I just napped and ate snacks. 😴'] }
];

// Things she says using something you told her earlier.
function factLine() {
    const f = pet.facts || {};

    const options = [];
    if (f.food)     options.push(`I keep thinking about ${f.food}. 🤤`);
    if (f.colour)   options.push(`Guess what? I saw something ${f.colour} today! 🎨`);
    if (f.yourname) options.push(`I like saying your name. ${f.yourname}! 💜`);
    if (f.game)     options.push(pick([`Is ${f.game} still your favourite? 🎮`,
                                       `I tried playing ${f.game}. I was TERRIBLE. 😂`,
                                       `Teach me ${f.game} one day? 🥺`]));
    if (f.place)    options.push(`Can we go to ${f.place} again? 🥺`);

    return options.length ? pick(options) : null;
}

/* Keeps her from saying the same thing twice in a row. Without this she
   repeats herself constantly and the illusion falls apart. */
let recentLines = [];

function freshPick(list) {
    const unused = list.filter(l => !recentLines.includes(l));
    const chosen = pick(unused.length ? unused : list);

    recentLines.push(chosen);
    if (recentLines.length > 8) recentLines.shift();

    return chosen;
}

// Tidies your message up before looking at it, so "HI!!!" and "hi" match.
function tidy(text) {
    return ' ' + text.toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
}

function replyTo(text) {
    const lower = tidy(text);
    const raw   = text.trim();

    /* 1. Is this the answer to something she just asked?
          Checked first, because if she asked "what's your favourite food"
          and you say "pizza", she should hear an answer, not a food topic. */
    if (pet.asked) {
        const q = QUESTIONS.find(x => x.key === pet.asked);
        pet.asked = null;

        // "I don't know" is not an answer worth remembering.
        const dodged = /^(i dunno|dunno|idk|i don't know|i dont know|nothing|no)$/i.test(raw);

        if (q && !dodged && raw.length <= 40) {
            if (!pet.facts) pet.facts = {};
            pet.facts[q.key] = raw;
            save();
            return q.reply(raw);
        }
        if (q && dodged) return ['That\'s okay! 💜', 'Ask me something instead. 😄'];
    }

    /* 2. Does it match one of her topics? */
    let lines = null;

    for (const rule of TEXT_REPLIES) {
        if (rule.words.some(w => lower.includes(' ' + w) || lower.includes(w + ' '))) {
            lines = rule.say();
            break;
        }
    }

    /* 3. A question she has no answer for. */
    if (!lines && raw.includes('?')) {
        lines = [freshPick([
            'Hmm, I don\'t know! I\'m only a baby dragon. 🐉',
            'Good question! Ask me an easier one. 😅',
            'I have NO idea. 🤷',
            'Let me think... nope, nothing. 😂'
        ])];
    }

    /* 4. Nothing matched. She reacts to what you actually typed rather than
          ignoring it, which is what stops her feeling like a robot. */
    if (!lines) {
        const short = raw.length <= 24 ? raw : raw.slice(0, 22) + '...';
        lines = [freshPick([
            `"${short}"? Tell me more! 👀`,
            `Ooh, ${short}! 😄`,
            'Really?? 😲',
            'That\'s so interesting! 💜',
            'No wayyy! 😂',
            `I've been thinking about that too. 🤔`
        ])];
    }

    /* 5. Sometimes she says something using a thing you told her before. */
    if (pet.facts && Math.random() < 0.25) {
        const f = factLine();
        if (f) lines = lines.concat(f);
    }

    /* 6. And roughly half the time she asks you something back, which is the
          bit that keeps a conversation going instead of ending it. */
    if (Math.random() < 0.5) {
        const unasked = QUESTIONS.filter(q => !(pet.facts && pet.facts[q.key]));
        const pool = unasked.length ? unasked : QUESTIONS;
        const q = pick(pool);

        pet.asked = q.key;
        lines = lines.concat(q.ask);
        save();
    }

    return lines;
}

function showView(name) {
    pviews.forEach(v => v.classList.toggle('active', v.classList.contains('pview-' + name)));
}

// Puts a small copy of Lydia into any box on the phone.
function fillDragon(el, extraClass) {
    el.innerHTML = dragonHTML();
    const d = el.querySelector('.dragon');
    d.className = 'dragon ' + mood() + (extraClass ? ' ' + extraClass : '');
}

phoneBtn.addEventListener('click', () => {
    phone.classList.remove('hidden');
    contactName.textContent = pet.name;
    textHeader.textContent  = pet.name + ' 💜';
    fillDragon(phoneAvatar);
    showView('home');
});

phoneClose.addEventListener('click', closePhone);
phoneBack.addEventListener('click', () => {
    clearTimeout(callTimer);
    showView('home');
});

function closePhone() {
    clearTimeout(callTimer);
    phone.classList.add('hidden');
}

pvBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        if (view === 'call')  startCall();
        if (view === 'text')  openTexts();
        if (view === 'face')  startFaceTime();
    });
});


/* ---------- Voice call ---------- */

function startCall() {
    showView('call');
    callName.textContent = pet.name;
    fillDragon(callAvatar, 'calling');

    callStatus.textContent = 'Calling...';
    callBubble.textContent = '';
    callBubble.classList.remove('show');

    // A short wait before she picks up, because an instant answer feels
    // fake. Real phones ring for a moment.
    clearTimeout(callTimer);
    callTimer = setTimeout(() => {
        if (pet.asleep) {
            callStatus.textContent = 'No answer 😴';
            callBubble.textContent = 'She\'s fast asleep. Try again when she wakes up!';
            callBubble.classList.add('show');
            return;
        }

        callStatus.textContent = 'Connected 🟢';
        callBubble.textContent = WHERE_LINES[pet.room] + ' ' + pickLine();
        callBubble.classList.add('show');

        // Hearing from you cheers her up a little.
        pet.happy = clamp(pet.happy + 6);
        save();
        render();
    }, 1600);
}

document.getElementById('hang-up').addEventListener('click', () => {
    clearTimeout(callTimer);
    showView('home');
});


/* ---------- Texting ---------- */

function openTexts() {
    showView('text');
    drawMessages();
    textInput.focus();
}

function drawMessages() {
    const list = pet.texts || [];
    messagesEl.innerHTML = '';

    if (list.length === 0) {
        messagesEl.innerHTML =
            '<div class="msg-empty">Say hi to ' + pet.name + '! 💬<br><br>' +
            'She asks questions back, and she remembers what you tell her.</div>';
        return;
    }

    for (const m of list) {
        const div = document.createElement('div');
        div.className = 'msg msg-' + m.from;
        div.textContent = m.text;
        messagesEl.appendChild(div);
    }

    // Always show the newest message rather than the top of the list.
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(from, text) {
    if (!pet.texts) pet.texts = [];
    pet.texts.push({ from, text });

    // Only the last 30 are kept, so a long chat cannot grow forever.
    if (pet.texts.length > 30) pet.texts = pet.texts.slice(-30);

    save();
    drawMessages();
}

// Shows the three bouncing dots while she is "typing".
function showTyping(on) {
    let dots = document.getElementById('typing');

    if (on) {
        if (dots) return;
        dots = document.createElement('div');
        dots.id = 'typing';
        dots.className = 'msg msg-her typing';
        dots.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(dots);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (dots) {
        dots.remove();
    }
}

function sendText() {
    const typed = textInput.value.trim();
    if (typed === '') return;

    addMessage('me', typed);
    textInput.value = '';

    if (pet.asleep) {
        setTimeout(() => addMessage('her', 'zzz... 💤'), 900);
        return;
    }

    // She works out what to say, then sends it one message at a time with a
    // pause between, the way a real person texts.
    const replies = replyTo(typed);

    showTyping(true);

    replies.forEach((line, i) => {
        setTimeout(() => {
            showTyping(false);
            addMessage('her', line);

            // Still more to come, so the dots come back.
            if (i < replies.length - 1) showTyping(true);
        }, 850 + i * 1100);
    });

    pet.happy = clamp(pet.happy + 4);
    save();
    render();
}

sendBtn.addEventListener('click', sendText);
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendText();
});


/* ---------- FaceTime ---------- */

function startFaceTime() {
    showView('face');
    fillDragon(faceDragon);

    faceWhere.textContent = WHERE_LINES[pet.room];

    faceBubble.textContent = pet.asleep
        ? 'She\'s asleep! Look how cute. 💤'
        : pickLine();

    if (!pet.asleep) {
        pet.happy = clamp(pet.happy + 8);   // seeing your face is the best
        save();
        render();
    }
}

document.getElementById('face-hang').addEventListener('click', () => showView('home'));


/* ---------- Lydia's own phone ---------- */

/* She has a phone too, so sometimes she rings you first. It only happens
   when she needs something and only when the phone is closed, otherwise
   she would interrupt you mid-call. */

const incomingEl = document.createElement('div');
incomingEl.id = 'incoming';
incomingEl.className = 'hidden';
incomingEl.innerHTML =
    '<span class="ring-icon">📱</span>' +
    '<span class="ring-text"><b id="ring-who">Lydia</b><br>is calling you...</span>' +
    '<button id="ring-answer">Answer</button>' +
    '<button id="ring-ignore" class="link-btn">Later</button>';
document.getElementById('game-container').appendChild(incomingEl);

const ringWho = incomingEl.querySelector('#ring-who');

function maybeSheCalls() {
    if (!pet || pet.asleep) return;
    if (!phone.classList.contains('hidden')) return;   // already on the phone
    if (!incomingEl.classList.contains('hidden')) return;

    // She only rings when something is actually wrong, so a ringing phone
    // always means she needs you.
    const needsSomething = pet.hunger < 32 || pet.happy < 32 || pet.energy < 22;
    if (!needsSomething) return;

    ringWho.textContent = pet.name;
    incomingEl.classList.remove('hidden');
}

incomingEl.querySelector('#ring-answer').addEventListener('click', () => {
    incomingEl.classList.add('hidden');
    phone.classList.remove('hidden');
    contactName.textContent = pet.name;
    textHeader.textContent  = pet.name + ' 💜';
    fillDragon(phoneAvatar);
    startCall();
});

incomingEl.querySelector('#ring-ignore').addEventListener('click', () => {
    incomingEl.classList.add('hidden');
});

// She tries every 45 seconds, so she is never annoying about it.
setInterval(maybeSheCalls, 45000);


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
