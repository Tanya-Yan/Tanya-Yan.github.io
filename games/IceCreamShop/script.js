/* ============================================================
   ICE CREAM SHOP
   Customers come in, order, and pay. You scoop.
   ============================================================ */

const CONES = [
    { id: 'waffle', label: 'Waffle', cls: 'cone-waffle', emoji: '🍦', price: 2 },
    { id: 'plain',  label: 'Plain',  cls: 'cone-plain',  emoji: '🍨', price: 1 },
    { id: 'cup',    label: 'Cup',    cls: 'cone-cup',    emoji: '🥣', price: 1 }
];

const FLAVOURS = [
    { id: 'strawberry', label: 'Strawberry', hex: '#fb7185', price: 2 },
    { id: 'vanilla',    label: 'Vanilla',    hex: '#fef3c7', price: 2 },
    { id: 'chocolate',  label: 'Chocolate',  hex: '#92400e', price: 2 },
    { id: 'mint',       label: 'Mint',       hex: '#6ee7b7', price: 2 },
    { id: 'blueberry',  label: 'Blueberry',  hex: '#818cf8', price: 2 },
    { id: 'bubblegum',  label: 'Bubblegum',  hex: '#f0abfc', price: 2 },
    { id: 'mango',      label: 'Mango',      hex: '#fbbf24', price: 2 },
    { id: 'cookies',    label: 'Cookies',    hex: '#d6d3d1', price: 2 },
    { id: 'unicorn',    label: 'Unicorn',    hex: '#e9d5ff', price: 3 },
    { id: 'galaxy',     label: 'Galaxy',     hex: '#4c1d95', price: 3 },
    { id: 'lemon',      label: 'Lemon',      hex: '#fef08a', price: 2 },
    { id: 'cherry',     label: 'Cherry',     hex: '#dc2626', price: 2 },
    { id: 'coconut',    label: 'Coconut',    hex: '#fafaf9', price: 2 },
    { id: 'caramel',    label: 'Caramel',    hex: '#d97706', price: 2 },
    { id: 'matcha',     label: 'Matcha',     hex: '#84cc16', price: 3 },
    { id: 'rainbow',    label: 'Rainbow',    hex: '#f97316', price: 3 }
];

const TOPPINGS = [
    { id: 'sprinkles', label: 'Sprinkles', emoji: '🌈', price: 1 },
    { id: 'cherry',    label: 'Cherry',    emoji: '🍒', price: 1 },
    { id: 'sauce',     label: 'Sauce',     emoji: '🍫', price: 1 },
    { id: 'flake',     label: 'Flake',     emoji: '🍪', price: 1 },
    { id: 'nuts',      label: 'Nuts',      emoji: '🥜', price: 1 },
    { id: 'marshmallow', label: 'Marshmallow', emoji: '☁️', price: 1 },
    { id: 'banana',    label: 'Banana',    emoji: '🍌', price: 1 },
    { id: 'strawbits', label: 'Berries',   emoji: '🍓', price: 1 },
    { id: 'honey',     label: 'Honey',     emoji: '🍯', price: 1 },
    { id: 'candy',     label: 'Candy',     emoji: '🍬', price: 1 },
    { id: 'popcorn',   label: 'Popcorn',   emoji: '🍿', price: 1 },
    { id: 'star',      label: 'Star',      emoji: '⭐', price: 2 }
];

/* Real customers, each with a face and a name, so the shop feels like a
   place with people in it rather than a list of orders. */
const CUSTOMERS = [
    { face: '👧', name: 'Mia' },      { face: '👦', name: 'Ben' },
    { face: '🧑', name: 'Alex' },     { face: '👩', name: 'Priya' },
    { face: '👨', name: 'Marcus' },   { face: '👵', name: 'Nana Rose' },
    { face: '👴', name: 'Grandpa Joe' }, { face: '🧒', name: 'Sam' },
    { face: '👩‍🦰', name: 'Ruby' },    { face: '🧑‍🎤', name: 'Zee' },
    { face: '👮', name: 'Officer Dee' }, { face: '👩‍🚀', name: 'Captain Nova' },
    { face: '🐉', name: 'Lydia' },    { face: '🧙', name: 'Wizard Bo' },
    { face: '🧜‍♀️', name: 'Coral' },   { face: '🦸‍♀️', name: 'Super Sky' },
    { face: '👸', name: 'Princess Ivy' }, { face: '🤠', name: 'Cowboy Cal' },
    { face: '👽', name: 'Zorp' },     { face: '🧑‍🍳', name: 'Chef Remy' },
    { face: '🐻', name: 'Barnaby Bear' }, { face: '🦄', name: 'Sprinkle' },
    { face: '🧑‍🚒', name: 'Kai' },     { face: '🐧', name: 'Pip' },
    { face: '🧚', name: 'Fern' },     { face: '🤖', name: 'Bolt' }
];

/* Some customers turn up together and have their own thing going on.
   Lydia and Wizard Bo are getting married today, so they come in as a
   pair with wedding lines instead of the usual greeting. */
const PAIRS = [
    {
        face: '🐉🧙',
        name: 'Lydia & Wizard Bo',
        chance: 0.18,
        openers: [
            'WE\'RE GETTING MARRIED TODAY! In PARIS! 💍🗼',
            'Bonjour! It\'s our wedding day in Paris! 💒🇫🇷',
            'Ice cream for the happy couple! We fly to Paris tonight! ✈️🗼',
            'Straight from the ceremony under the Eiffel Tower! 🗼💐'
        ],
        endings: [
            ' ...for the wedding in Paris! 🗼',
            ' ...and put it on the cake table! 🎂',
            ' ...we\'re celebrating! 🎉'
        ]
    }
];

const NOTES = [5, 10, 20, 50];   // the notes customers pay with

const MAX_SCOOPS = 10;   // the tallest tower the shop will build

// Roughly one order in five is a giant one, so a ten scooper is a treat
// rather than the normal thing.
const BIG_ORDER_CHANCE = 0.2;


/* ---------- Pieces of the page ---------- */

const startScreen = document.getElementById('start-screen');
const shopScreen  = document.getElementById('shop-screen');
const payScreen   = document.getElementById('pay-screen');

const moneyEl     = document.getElementById('money');
const servedEl    = document.getElementById('served');
const tipsEl      = document.getElementById('tips');

const orderText   = document.getElementById('order-text');
const customerEl  = document.getElementById('customer');
const custNameEl  = document.getElementById('customer-name');

const coneEl      = document.getElementById('cone');
const scoopsEl    = document.getElementById('scoops');
const toppingsEl  = document.getElementById('toppings-layer');
const buildLabel  = document.getElementById('build-label');

const conesRow    = document.getElementById('cones-row');
const flavoursRow = document.getElementById('flavours-row');
const toppingsRow = document.getElementById('toppings-row');

const payTitle    = document.getElementById('pay-title');
const paySays     = document.getElementById('pay-says');
const readerScreen= document.getElementById('reader-screen');
const readerEl    = document.getElementById('reader');
const cashArea    = document.getElementById('cash-area');
const cashNote    = document.getElementById('cash-note');
const changeRow   = document.getElementById('change-row');
const payResult   = document.getElementById('pay-result');


/* ---------- The shop's memory ---------- */

let money  = 0;
let tips   = 0;
let served = 0;

let order = null;    // what the customer asked for
let built = null;    // what you have made so far
let bill  = 0;       // what this order costs

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }


/* ---------- Building the ingredient tray ---------- */

function buildTray() {
    for (const c of CONES) {
        conesRow.appendChild(makeItem(`<span class="emoji">${c.emoji}</span>`, c.label,
            () => chooseCone(c)));
    }

    for (const f of FLAVOURS) {
        conesRow;   // (kept separate below for clarity)
        flavoursRow.appendChild(makeItem(
            `<span class="blob" style="background:${f.hex}"></span>`, f.label,
            () => addScoop(f)));
    }

    for (const t of TOPPINGS) {
        toppingsRow.appendChild(makeItem(`<span class="emoji">${t.emoji}</span>`, t.label,
            () => addTopping(t)));
    }
}

function makeItem(inner, label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'item';
    btn.innerHTML = inner + '<span>' + label + '</span>';
    btn.addEventListener('click', onClick);
    return btn;
}


/* ---------- Making an ice cream ---------- */

function chooseCone(c) {
    built.cone = c;
    coneEl.className = c.cls;
    buildLabel.textContent = `${c.label} ready. Now add scoops!`;
}

function addScoop(f) {
    if (!built.cone) {
        buildLabel.textContent = 'Pick a cone first! 👇';
        return;
    }
    if (built.scoops.length >= MAX_SCOOPS) {
        buildLabel.textContent = `${MAX_SCOOPS} scoops is the tallest that will balance!`;
        return;
    }

    built.scoops.push(f);

    const s = document.createElement('div');
    s.className = 'scoop';
    s.style.background = f.hex;
    scoopsEl.appendChild(s);

    fitScoops();

    const n = built.scoops.length;
    buildLabel.textContent = n >= 8 ? `${n} scoops! That is a TOWER 🗼`
                           : n >= 5 ? `${n} scoops! Careful... 😅`
                           : `${n} scoop${n > 1 ? 's' : ''}`;
}

function addTopping(t) {
    if (!built.cone) {
        buildLabel.textContent = 'Pick a cone first! 👇';
        return;
    }
    if (built.toppings.some(x => x.id === t.id)) {
        buildLabel.textContent = `Already got ${t.label}!`;
        return;
    }

    built.toppings.push(t);

    const el = document.createElement('span');
    el.textContent = t.emoji;
    toppingsEl.appendChild(el);

    buildLabel.textContent = `${t.label} added!`;
}

/* A tall tower would shoot off the top of the screen, so the whole stack
   shrinks as it grows. Five scoops stay full size, and by ten they are
   half size, which keeps even the biggest tower inside its box.
   transform-origin sits at the bottom so it shrinks towards the cone
   rather than towards the middle. */
function fitScoops() {
    const n = built.scoops.length;
    const scale = n <= 4 ? 1 : Math.max(0.46, 4.6 / n);
    scoopsEl.style.transform = `scale(${scale})`;
}

function clearBuild() {
    built = { cone: null, scoops: [], toppings: [] };
    coneEl.className = '';
    scoopsEl.innerHTML = '';
    scoopsEl.style.transform = 'scale(1)';
    toppingsEl.innerHTML = '';
    buildLabel.textContent = 'Tap a cone to start';
}


/* ---------- A new customer ---------- */

function nextCustomer() {
    // Now and then a pair comes in instead of a single customer.
    const pair = PAIRS.find(p => Math.random() < p.chance) || null;
    const who  = pair || pick(CUSTOMERS);

    // Usually one to three scoops, but now and then somebody wants a tower
    // of up to ten.
    const big = Math.random() < BIG_ORDER_CHANCE;
    const scoopCount = big
        ? 4 + Math.floor(Math.random() * (MAX_SCOOPS - 3))   // 4 up to 10
        : 1 + Math.floor(Math.random() * 3);                 // 1, 2 or 3

    const wantScoops = [];
    for (let i = 0; i < scoopCount; i++) wantScoops.push(pick(FLAVOURS));

    const wantToppings = [];
    const topCount = Math.floor(Math.random() * 3);   // 0, 1 or 2
    while (wantToppings.length < topCount) {
        const t = pick(TOPPINGS);
        if (!wantToppings.some(x => x.id === t.id)) wantToppings.push(t);
    }

    order = {
        who,
        pair,
        cone: pick(CONES),
        scoops: wantScoops,
        toppings: wantToppings,
        // How they want to pay, decided now so they can say it out loud.
        payWith: Math.random() < 0.6 ? pick(['tap', 'insert', 'swipe']) : 'cash'
    };

    bill = order.cone.price
         + order.scoops.reduce((n, s) => n + s.price, 0)
         + order.toppings.reduce((n, t) => n + t.price, 0);

    customerEl.textContent = who.face;
    custNameEl.textContent = who.name;

    // Restart the walk-in animation for the new customer.
    customerEl.style.animation = 'none';
    void customerEl.offsetWidth;
    customerEl.style.animation = '';

    orderText.textContent = orderSentence(order);

    clearBuild();
}

// Turns the order into something a person would actually say.
function orderSentence(o) {
    const names = o.scoops.map(s => s.label.toLowerCase());
    let scoopBit;

    if (names.length === 1) {
        scoopBit = `a scoop of ${names[0]}`;
    } else {
        scoopBit = `${names.length} scoops: ` +
                   names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    }

    // A pair has its own lines. Otherwise a giant order gets an excited
    // opener, and everything else gets a normal hello.
    const opener = o.pair
        ? pick(o.pair.openers)
        : names.length >= 6
            ? pick(['I\'m SO hungry!', 'It\'s for a party!', 'Go BIG today!',
                    'You won\'t believe this order...'])
            : pick(['Hi!', 'Hello!', 'Hiya!', 'Afternoon!']);

    let s = `${opener} Can I get ` +
            `${scoopBit} in a ${o.cone.label.toLowerCase()} ${o.cone.id === 'cup' ? '' : 'cone'}`;

    if (o.toppings.length) {
        s += ', with ' + o.toppings.map(t => t.label.toLowerCase()).join(' and ');
    }

    return s.trim() + '?';
}


/* ---------- Checking the order ---------- */

// Compares two lists of ingredients without caring what order they are in,
// because nobody minds which scoop went on first.
function sameStuff(a, b) {
    if (a.length !== b.length) return false;

    const left  = a.map(x => x.id).sort();
    const right = b.map(x => x.id).sort();

    return left.every((id, i) => id === right[i]);
}

document.getElementById('serve-btn').addEventListener('click', () => {
    if (!built.cone) {
        buildLabel.textContent = 'There is nothing to serve yet!';
        return;
    }

    const coneOk = built.cone.id === order.cone.id;
    const scoopOk = sameStuff(built.scoops, order.scoops);
    const topOk  = sameStuff(built.toppings, order.toppings);

    if (coneOk && scoopOk && topOk) {
        goToPay(true);
        return;
    }

    // Wrong, so say exactly what is off rather than just "no".
    let problem = 'Hmm, ';
    if (!coneOk)       problem += `I wanted a ${order.cone.label.toLowerCase()}!`;
    else if (!scoopOk) problem += `that's not the scoops I asked for!`;
    else               problem += `check my toppings again!`;

    orderText.textContent = problem + ' ' + orderSentence(order);
    buildLabel.textContent = 'Not quite! Press 🗑️ and try again.';
});

document.getElementById('bin-btn').addEventListener('click', clearBuild);


/* ---------- Paying ---------- */

function goToPay(perfect) {
    shopScreen.classList.remove('active');
    payScreen.classList.add('active');

    payTitle.textContent = `That's $${bill} please!`;
    payResult.textContent = '';
    readerScreen.textContent = 'READY';
    readerScreen.style.background = '#86efac';

    document.querySelectorAll('.pay-btn').forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = false;
    });

    if (order.payWith === 'cash') {
        readerEl.classList.add('hidden');
        cashArea.classList.remove('hidden');
        setUpCash();
    } else {
        readerEl.classList.remove('hidden');
        cashArea.classList.add('hidden');

        paySays.textContent = {
            tap:    `${order.who.name} says: "I'll tap my card." 📶`,
            insert: `${order.who.name} says: "Tap isn't working, I'll insert it." 💳`,
            swipe:  `${order.who.name} says: "My card is old, I'll swipe it." ↔️`
        }[order.payWith];
    }
}

// --- card ---

document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.pay;

        if (choice !== order.payWith) {
            btn.classList.add('wrong');
            readerScreen.textContent = 'DECLINED';
            readerScreen.style.background = '#fca5a5';
            payResult.textContent = `That's not how ${order.who.name} wants to pay! Try again.`;
            setTimeout(() => {
                btn.classList.remove('wrong');
                readerScreen.textContent = 'READY';
                readerScreen.style.background = '#86efac';
            }, 1200);
            return;
        }

        btn.classList.add('correct');
        document.querySelectorAll('.pay-btn').forEach(b => b.disabled = true);

        // The machine takes a moment to think, like a real one.
        readerScreen.textContent = 'PROCESSING';
        readerScreen.style.background = '#fde68a';

        setTimeout(() => {
            readerScreen.textContent = 'APPROVED ✓';
            readerScreen.style.background = '#86efac';
            finishSale(bill, true);
        }, 1300);
    });
});

// --- cash ---

function setUpCash() {
    // The smallest note that still covers the bill.
    const note = NOTES.find(n => n >= bill) || 20;
    const correct = note - bill;

    paySays.textContent = `${order.who.name} says: "No card today, here's cash!" 💵`;
    cashNote.textContent = `They hand you 💵 $${note}`;
    document.getElementById('change-question').textContent =
        `The ice cream is $${bill}. How much change do you give back?`;

    // Three wrong answers near the right one, so it needs real thinking.
    const options = new Set([correct]);
    while (options.size < 4) {
        const wrong = correct + (Math.floor(Math.random() * 9) - 4);
        if (wrong >= 0 && wrong !== correct) options.add(wrong);
    }

    const shuffled = [...options].sort(() => Math.random() - 0.5);

    changeRow.innerHTML = '';
    for (const amount of shuffled) {
        const btn = document.createElement('button');
        btn.className = 'change-btn';
        btn.textContent = `$${amount}`;

        btn.addEventListener('click', () => {
            if (amount === correct) {
                payResult.textContent = `Perfect change! 🎉`;
                changeRow.querySelectorAll('button').forEach(b => b.disabled = true);
                setTimeout(() => finishSale(bill, true), 900);
            } else {
                btn.style.background = '#dc2626';
                payResult.textContent = `Not quite. $${note} take away $${bill}...`;
            }
        });

        changeRow.appendChild(btn);
    }
}

function finishSale(amount, happy) {
    money  += amount;
    served += 1;

    // A happy customer leaves a tip.
    const tip = happy ? 1 + Math.floor(Math.random() * 3) : 0;
    tips  += tip;
    money += tip;

    moneyEl.textContent  = `💵 $${money}`;
    servedEl.textContent = `🍦 ${served} served`;
    tipsEl.textContent   = `⭐ $${tips} tips`;

    payResult.textContent = tip
        ? `${order.who.name}: "Keep the change!" +$${tip} tip ⭐`
        : `${order.who.name} says thank you!`;

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });

    setTimeout(() => {
        payScreen.classList.remove('active');
        shopScreen.classList.add('active');
        nextCustomer();
    }, 1800);
}


/* ---------- Go ---------- */

document.getElementById('open-btn').addEventListener('click', () => {
    startScreen.classList.remove('active');
    shopScreen.classList.add('active');
    clearBuild();
    nextCustomer();
});

buildTray();
clearBuild();
