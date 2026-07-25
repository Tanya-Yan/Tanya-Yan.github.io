/* ============================================================
   PIZZA SHOP
   Take the order, build it, then bake it just right.
   ============================================================ */

const SIZES = [
    { id: 'small',  label: 'Small',  cls: 'size-small',  price: 6 },
    { id: 'medium', label: 'Medium', cls: 'size-medium', price: 9 },
    { id: 'large',  label: 'Large',  cls: 'size-large',  price: 13 }
];

const TOPPINGS = [
    { id: 'pepperoni', label: 'Pepperoni', emoji: '🔴', price: 2 },
    { id: 'mushroom',  label: 'Mushroom',  emoji: '🍄', price: 1 },
    { id: 'pepper',    label: 'Pepper',    emoji: '🫑', price: 1 },
    { id: 'olive',     label: 'Olives',    emoji: '⚫', price: 1 },
    { id: 'pineapple', label: 'Pineapple', emoji: '🍍', price: 2 },
    { id: 'corn',      label: 'Sweetcorn', emoji: '🌽', price: 1 },
    { id: 'chilli',    label: 'Chilli',    emoji: '🌶️', price: 1 },
    { id: 'basil',     label: 'Basil',     emoji: '🌿', price: 1 },
    { id: 'cheese',    label: 'Extra cheese', emoji: '🧀', price: 2 },
    { id: 'bacon',     label: 'Bacon',     emoji: '🥓', price: 2 },
    { id: 'prawn',     label: 'Prawns',    emoji: '🍤', price: 3 },
    { id: 'chicken',   label: 'Chicken',   emoji: '🍗', price: 2 },
    { id: 'tomato',    label: 'Tomato',    emoji: '🍅', price: 1 },
    { id: 'onion',     label: 'Onion',     emoji: '🧅', price: 1 },
    { id: 'broccoli',  label: 'Broccoli',  emoji: '🥦', price: 1 },
    { id: 'egg',       label: 'Egg',       emoji: '🍳', price: 2 },
    { id: 'avocado',   label: 'Avocado',   emoji: '🥑', price: 2 },
    { id: 'garlic',    label: 'Garlic',    emoji: '🧄', price: 1 }
];

/* Whole pizzas people ask for by name. Ordering one of these instead of a
   list of toppings makes the shop sound like a real pizza place. */
const SPECIALS = [
    { name: 'Margherita', toppings: ['tomato', 'basil'] },
    { name: 'Hawaiian',   toppings: ['pineapple', 'chicken'] },
    { name: 'Veggie',     toppings: ['pepper', 'mushroom', 'onion', 'broccoli'] },
    { name: 'Meat Feast', toppings: ['pepperoni', 'bacon', 'chicken'] },
    { name: 'Spicy One',  toppings: ['chilli', 'pepperoni', 'onion'] },
    { name: 'Four Cheese',toppings: ['cheese', 'garlic'] }
];

const CUSTOMERS = [
    { face: '👧', name: 'Mia' },       { face: '👦', name: 'Ben' },
    { face: '🧑', name: 'Alex' },      { face: '👩', name: 'Priya' },
    { face: '👨', name: 'Marcus' },    { face: '👵', name: 'Nana Rose' },
    { face: '🧒', name: 'Sam' },       { face: '👩‍🦰', name: 'Ruby' },
    { face: '🧑‍🚒', name: 'Firefighter Kai' }, { face: '👷', name: 'Bob' },
    { face: '🐉', name: 'Lydia' },     { face: '🧙', name: 'Wizard Bo' },
    { face: '👽', name: 'Zorp' },      { face: '🦸', name: 'Captain Cheese' },
    { face: '🧜‍♀️', name: 'Coral' },    { face: '👸', name: 'Princess Ivy' },
    { face: '🤠', name: 'Cowboy Cal' }, { face: '🧑‍🍳', name: 'Chef Remy' },
    { face: '🐻', name: 'Barnaby Bear' }, { face: '🦄', name: 'Sprinkle' },
    { face: '🥷', name: 'Shadow' },    { face: '🤖', name: 'Bolt' },
    { face: '🧚', name: 'Fern' },      { face: '👮', name: 'Officer Dee' }
];

const NOTES = [10, 20, 50];

/* Baking. The bar fills from 0 to 100. Pull it out inside the green zone
   and the pizza is perfect. The numbers here must match the .bake-zone
   stripe in index.css, or the green bar would lie to you. */
const PERFECT_FROM = 62;
const PERFECT_TO   = 85;
const BAKE_SPEED   = 0.85;   // how much the bar fills each tick


/* ---------- Pieces of the page ---------- */

const startScreen = document.getElementById('start-screen');
const shopScreen  = document.getElementById('shop-screen');
const ovenScreen  = document.getElementById('oven-screen');
const payScreen   = document.getElementById('pay-screen');

const moneyEl   = document.getElementById('money');
const servedEl  = document.getElementById('served');
const perfectEl = document.getElementById('perfect');

const orderText  = document.getElementById('order-text');
const customerEl = document.getElementById('customer');
const custNameEl = document.getElementById('customer-name');

const pizzaEl    = document.getElementById('pizza');
const sauceEl    = document.getElementById('sauce');
const cheeseEl   = document.getElementById('cheese');
const topLayer   = document.getElementById('topping-layer');
const buildLabel = document.getElementById('build-label');

const ovenPizza   = document.getElementById('oven-pizza');
const ovenSauce   = document.getElementById('oven-sauce');
const ovenCheese  = document.getElementById('oven-cheese');
const ovenTops    = document.getElementById('oven-toppings');
const bakeFill    = document.getElementById('bake-fill');
const bakeResult  = document.getElementById('bake-result');
const takeOutBtn  = document.getElementById('take-out-btn');

const sizesRow    = document.getElementById('sizes-row');
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

let money = 0, served = 0, perfectCount = 0;
let order = null, built = null, bill = 0;
let bake = 0, bakeTimer = null, bakeQuality = 'perfect';

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }


/* ---------- Building the tray ---------- */

function buildTray() {
    for (const s of SIZES) {
        const btn = makeItem('🍕', s.label, () => chooseSize(s));
        btn.dataset.size = s.id;
        sizesRow.appendChild(btn);
    }

    for (const t of TOPPINGS) {
        toppingsRow.appendChild(makeItem(t.emoji, t.label, () => addTopping(t)));
    }
}

function makeItem(emoji, label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'item';
    btn.innerHTML = `<span class="emoji">${emoji}</span><span>${label}</span>`;
    btn.addEventListener('click', onClick);
    return btn;
}


/* ---------- Making a pizza ---------- */

function chooseSize(s) {
    built.size = s;

    pizzaEl.className = s.cls;
    sauceEl.classList.add('on');
    cheeseEl.classList.add('on');

    document.querySelectorAll('[data-size]').forEach(b =>
        b.classList.toggle('chosen', b.dataset.size === s.id));

    buildLabel.textContent = `${s.label} base with sauce and cheese. Add toppings!`;
}

function addTopping(t) {
    if (!built.size) {
        buildLabel.textContent = 'Pick a size first! 👇';
        return;
    }
    if (built.toppings.some(x => x.id === t.id)) {
        buildLabel.textContent = `Already got ${t.label}!`;
        return;
    }

    built.toppings.push(t);

    /* Scatter five of each topping around the pizza. Each one is placed by
       angle and distance from the middle rather than by x and y, which is
       what keeps them inside the circle instead of in the corners. */
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 12 + Math.random() * 26;      // percent from the middle

        const el = document.createElement('span');
        el.className = 'topping';
        el.textContent = t.emoji;
        el.style.left = (50 + Math.cos(angle) * dist) + '%';
        el.style.top  = (50 + Math.sin(angle) * dist) + '%';
        el.dataset.id = t.id;

        topLayer.appendChild(el);
    }

    buildLabel.textContent = `${t.label} added!`;
}

function clearBuild() {
    built = { size: null, toppings: [] };
    pizzaEl.className = 'size-medium';
    sauceEl.classList.remove('on');
    cheeseEl.classList.remove('on');
    topLayer.innerHTML = '';
    document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('chosen'));
    buildLabel.textContent = 'Pick a size to start';
}


/* ---------- A new customer ---------- */

function nextCustomer() {
    const who = pick(CUSTOMERS);

    // A third of customers order a pizza by name instead of listing
    // toppings, which sounds much more like a real pizza shop.
    const special = Math.random() < 0.34 ? pick(SPECIALS) : null;

    let wantToppings = [];

    if (special) {
        wantToppings = special.toppings.map(id => TOPPINGS.find(t => t.id === id));
    } else {
        const count = 1 + Math.floor(Math.random() * 4);   // 1 to 4 toppings
        while (wantToppings.length < count) {
            const t = pick(TOPPINGS);
            if (!wantToppings.some(x => x.id === t.id)) wantToppings.push(t);
        }
    }

    order = {
        who,
        special,
        size: pick(SIZES),
        toppings: wantToppings,
        payWith: Math.random() < 0.6 ? pick(['tap', 'insert', 'swipe']) : 'cash'
    };

    bill = order.size.price + order.toppings.reduce((n, t) => n + t.price, 0);

    customerEl.textContent = who.face;
    custNameEl.textContent = who.name;
    customerEl.style.animation = 'none';
    void customerEl.offsetWidth;
    customerEl.style.animation = '';

    const names = order.toppings.map(t => t.label.toLowerCase());
    const list = names.length === 1
        ? names[0]
        : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];

    const hello = pick(['Hi!', 'Hello!', 'Evening!', 'Hiya!']);

    // A named pizza still lists what goes on it, so it stays fair.
    orderText.textContent = order.special
        ? `${hello} A ${order.size.label.toLowerCase()} ${order.special.name} please! ` +
          `(that's ${list})`
        : `${hello} A ${order.size.label.toLowerCase()} pizza with ${list}, please!`;

    clearBuild();
}


/* ---------- Checking, then baking ---------- */

function sameStuff(a, b) {
    if (a.length !== b.length) return false;
    const l = a.map(x => x.id).sort(), r = b.map(x => x.id).sort();
    return l.every((id, i) => id === r[i]);
}

document.getElementById('bake-btn').addEventListener('click', () => {
    if (!built.size) {
        buildLabel.textContent = 'There is no pizza yet!';
        return;
    }

    if (built.size.id !== order.size.id) {
        buildLabel.textContent = `${order.who.name} wanted a ${order.size.label.toLowerCase()}!`;
        return;
    }

    if (!sameStuff(built.toppings, order.toppings)) {
        buildLabel.textContent = 'Those are not the right toppings! Press 🗑️ and try again.';
        return;
    }

    startBaking();
});

document.getElementById('bin-btn').addEventListener('click', clearBuild);

function startBaking() {
    shopScreen.classList.remove('active');
    ovenScreen.classList.add('active');

    // Copy the pizza into the oven so it is the same one going in.
    ovenPizza.className = built.size.cls;
    ovenSauce.classList.add('on');
    ovenCheese.classList.add('on');
    ovenTops.innerHTML = topLayer.innerHTML;

    bake = 0;
    bakeResult.textContent = '';
    takeOutBtn.disabled = false;

    clearInterval(bakeTimer);
    bakeTimer = setInterval(tickBake, 30);
}

function tickBake() {
    bake += BAKE_SPEED;
    bakeFill.style.width = Math.min(100, bake) + '%';

    /* The cheese browns as it cooks. The colour is worked out from how far
       along the bake is, so it goes pale, then golden, then burnt without
       needing separate pictures. */
    const b = Math.min(100, bake);
    let cheeseColour;
    if (b < PERFECT_FROM) {
        cheeseColour = '#f7d774';                       // still pale
    } else if (b <= PERFECT_TO) {
        cheeseColour = '#e0a63c';                       // golden
    } else if (b < 100) {
        cheeseColour = '#8a5a1e';                       // going dark
    } else {
        cheeseColour = '#3d2b17';                       // burnt
    }
    ovenCheese.style.background = cheeseColour;

    if (bake >= 100) {
        clearInterval(bakeTimer);
        takeOutBtn.disabled = true;
        bakeQuality = 'burnt';
        finishBake();
    }
}

takeOutBtn.addEventListener('click', () => {
    if (bake >= 100) return;

    clearInterval(bakeTimer);
    takeOutBtn.disabled = true;

    bakeQuality = bake < PERFECT_FROM ? 'doughy'
                : bake <= PERFECT_TO  ? 'perfect'
                : 'burnt';

    finishBake();
});

function finishBake() {
    const messages = {
        perfect: '🔥 PERFECT! Golden and gorgeous!',
        doughy:  '😬 A bit doughy... it came out too soon.',
        burnt:   '🥵 Burnt! You left it in too long.'
    };

    bakeResult.textContent = messages[bakeQuality];

    if (bakeQuality === 'perfect') {
        perfectCount++;
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    }

    setTimeout(goToPay, 1700);
}


/* ---------- Paying ---------- */

function goToPay() {
    ovenScreen.classList.remove('active');
    payScreen.classList.add('active');

    // A bad pizza gets a discount, because it is only fair.
    const owed = bakeQuality === 'perfect' ? bill : Math.max(1, bill - 3);
    bill = owed;

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

document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.dataset.pay !== order.payWith) {
            btn.classList.add('wrong');
            readerScreen.textContent = 'DECLINED';
            readerScreen.style.background = '#fca5a5';
            payResult.textContent = `That is not how ${order.who.name} wants to pay!`;
            setTimeout(() => {
                btn.classList.remove('wrong');
                readerScreen.textContent = 'READY';
                readerScreen.style.background = '#86efac';
            }, 1200);
            return;
        }

        btn.classList.add('correct');
        document.querySelectorAll('.pay-btn').forEach(b => b.disabled = true);

        readerScreen.textContent = 'PROCESSING';
        readerScreen.style.background = '#fde68a';

        setTimeout(() => {
            readerScreen.textContent = 'APPROVED ✓';
            readerScreen.style.background = '#86efac';
            finishSale();
        }, 1300);
    });
});

function setUpCash() {
    const note = NOTES.find(n => n >= bill) || 50;
    const correct = note - bill;

    paySays.textContent = `${order.who.name} says: "Cash today!" 💵`;
    cashNote.textContent = `They hand you 💵 $${note}`;
    document.getElementById('change-question').textContent =
        `The pizza is $${bill}. How much change do you give back?`;

    const options = new Set([correct]);
    while (options.size < 4) {
        const wrong = correct + (Math.floor(Math.random() * 9) - 4);
        if (wrong >= 0 && wrong !== correct) options.add(wrong);
    }

    changeRow.innerHTML = '';
    for (const amount of [...options].sort(() => Math.random() - 0.5)) {
        const btn = document.createElement('button');
        btn.className = 'change-btn';
        btn.textContent = `$${amount}`;

        btn.addEventListener('click', () => {
            if (amount === correct) {
                payResult.textContent = 'Perfect change! 🎉';
                changeRow.querySelectorAll('button').forEach(b => b.disabled = true);
                setTimeout(finishSale, 900);
            } else {
                btn.style.background = '#dc2626';
                payResult.textContent = `Not quite. $${note} take away $${bill}...`;
            }
        });

        changeRow.appendChild(btn);
    }
}

function finishSale() {
    money += bill;
    served++;

    // Only a perfect pizza earns a tip.
    const tip = bakeQuality === 'perfect' ? 1 + Math.floor(Math.random() * 3) : 0;
    money += tip;

    moneyEl.textContent   = `💵 $${money}`;
    servedEl.textContent  = `🍕 ${served} made`;
    perfectEl.textContent = `🔥 ${perfectCount} perfect`;

    payResult.textContent = tip
        ? `${order.who.name}: "Best pizza ever!" +$${tip} tip ⭐`
        : `${order.who.name} takes the pizza and leaves.`;

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
