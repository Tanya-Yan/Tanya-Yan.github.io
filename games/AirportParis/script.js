/* ============================================================
   AIRPORT ✈️ PARIS
   You work the check-in desk. Do it well and you fly to Paris.
   ============================================================ */

const NEEDED_TO_FLY = 6;    // passengers boarded before your trip
const BAG_LIMIT     = 23;   // kilos before a bag costs extra

const CITIES = [
    { city: 'PARIS',     gate: 'A1' },
    { city: 'TOKYO',     gate: 'B4' },
    { city: 'NEW YORK',  gate: 'C2' },
    { city: 'ROME',      gate: 'A7' },
    { city: 'CAIRO',     gate: 'D3' },
    { city: 'SYDNEY',    gate: 'B9' },
    { city: 'REYKJAVIK', gate: 'C5' },
    { city: 'LIMA',      gate: 'D8' }
];

const PEOPLE = [
    { face: '👩', name: 'Priya Rao' },        { face: '👨', name: 'Marcus Bell' },
    { face: '👵', name: 'Rose Kim' },         { face: '🧑', name: 'Alex Stone' },
    { face: '👧', name: 'Mia Fox' },          { face: '👦', name: 'Ben Ito' },
    { face: '🧙', name: 'Wizard Bo' },        { face: '🐉', name: 'Lydia' },
    { face: '👽', name: 'Zorp' },             { face: '🦸', name: 'Sky Vance' },
    { face: '🤠', name: 'Cal Reed' },         { face: '🧜‍♀️', name: 'Coral Wynn' },
    { face: '👸', name: 'Ivy Sharpe' },       { face: '🤖', name: 'Bolt' },
    { face: '🧑‍🚒', name: 'Kai Osei' },        { face: '🐧', name: 'Pip Frost' }
];

/* The three things that can be wrong with a passenger. Each one has a
   line explaining it, so getting it wrong teaches you the rule. */
const PROBLEMS = {
    expired: 'Their passport ran out! You can\'t let them fly.',
    photo:   'The photo doesn\'t match their face! Turn them away.',
    heavy:   'Their bag is over 23 kg. Charge the extra bag fee.'
};


/* ---------- Pieces of the page ---------- */

const startScreen = document.getElementById('start-screen');
const deskScreen  = document.getElementById('desk-screen');
const parisScreen = document.getElementById('paris-screen');

const stampedEl  = document.getElementById('stamped');
const mistakesEl = document.getElementById('mistakes');
const toParisEl  = document.getElementById('to-paris');

const boardRows  = document.getElementById('board-rows');
const passFace   = document.getElementById('pass-face');
const passName   = document.getElementById('pass-name');
const passSub    = document.getElementById('pass-sub');

const ppName     = document.getElementById('pp-name');
const ppExpiry   = document.getElementById('pp-expiry');
const ppPhoto    = document.getElementById('pp-photo');

const bagWeight  = document.getElementById('bag-weight');
const readout    = document.querySelector('.scale-readout');

const deskLabel  = document.getElementById('desk-label');
const gatePanel  = document.getElementById('gate-panel');
const gateRow    = document.getElementById('gate-row');
const gateQ      = document.getElementById('gate-question');

const acceptBtn  = document.getElementById('accept-btn');
const rejectBtn  = document.getElementById('reject-btn');
const excessBtn  = document.getElementById('excess-btn');


/* ---------- Memory ---------- */

let boarded = 0, mistakes = 0;
let person = null;

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }


/* ---------- The departures board ---------- */

function drawBoard(theirCity) {
    boardRows.innerHTML = '';

    for (const c of CITIES) {
        const row = document.createElement('div');
        row.className = 'board-row' + (c.city === theirCity ? ' theirs' : '');
        row.innerHTML = `<span class="city">${c.city}</span><span class="gate">GATE ${c.gate}</span>`;
        boardRows.appendChild(row);
    }
}


/* ---------- A new passenger ---------- */

function nextPassenger() {
    const who  = pick(PEOPLE);
    const trip = pick(CITIES);

    // Roughly half have something wrong with them.
    const trouble = Math.random() < 0.5 ? pick(['expired', 'photo', 'heavy']) : null;

    const weight = trouble === 'heavy'
        ? BAG_LIMIT + 1 + Math.floor(Math.random() * 12)   // over the limit
        : 8 + Math.floor(Math.random() * 14);              // comfortably under

    person = {
        who,
        trip,
        trouble,
        weight,
        expiry: trouble === 'expired' ? '2021' : String(2027 + Math.floor(Math.random() * 6)),
        photoOk: trouble !== 'photo'
    };

    passFace.textContent = who.face;
    passFace.style.animation = 'none';
    void passFace.offsetWidth;
    passFace.style.animation = '';

    passName.textContent = who.name;
    passSub.textContent  = `flying to ${trip.city}`;

    ppName.textContent   = who.name;
    ppExpiry.textContent = person.expiry;
    ppExpiry.className   = trouble === 'expired' ? 'bad' : '';

    // A wrong photo shows a different face, so you can spot it by looking.
    let photoFace = who.face;
    if (!person.photoOk) {
        do { photoFace = pick(PEOPLE).face; } while (photoFace === who.face);
    }
    ppPhoto.textContent = photoFace;
    ppPhoto.className   = person.photoOk ? '' : 'bad';

    bagWeight.textContent = person.weight;
    readout.classList.toggle('over', person.weight > BAG_LIMIT);

    drawBoard(trip.city);

    gatePanel.classList.add('hidden');
    setButtons(true);
    deskLabel.textContent = 'Check the passport and the bag, then decide.';
}

function setButtons(on) {
    acceptBtn.disabled = !on;
    rejectBtn.disabled = !on;
    excessBtn.disabled = !on;
}


/* ---------- Your decision ---------- */

acceptBtn.addEventListener('click', () => decide('accept'));
rejectBtn.addEventListener('click', () => decide('reject'));
excessBtn.addEventListener('click', () => decide('excess'));

function decide(choice) {
    // The right answer for this passenger.
    const right = person.trouble === null    ? 'accept'
                : person.trouble === 'heavy' ? 'excess'
                : 'reject';

    if (choice !== right) {
        mistakes++;
        mistakesEl.textContent = `❌ ${mistakes} mistakes`;
        deskLabel.textContent = '❌ ' + (person.trouble
            ? PROBLEMS[person.trouble]
            : 'Nothing was wrong with them! You should have checked them in.');

        setButtons(false);
        setTimeout(nextPassenger, 2400);
        return;
    }

    // Turned away, so no gate is needed.
    if (choice === 'reject') {
        deskLabel.textContent = '✅ Good spot! ' + PROBLEMS[person.trouble];
        setButtons(false);
        setTimeout(nextPassenger, 2000);
        return;
    }

    // Checked in, so now pick their gate off the board.
    deskLabel.textContent = choice === 'excess'
        ? '✅ Fee charged. Now send them to their gate.'
        : '✅ All in order. Now send them to their gate.';

    setButtons(false);
    askGate();
}


/* ---------- Which gate ---------- */

function askGate() {
    gateQ.textContent = `Which gate for ${person.trip.city}? (check the board!)`;
    gateRow.innerHTML = '';

    // The right gate plus three wrong ones, shuffled.
    const others = CITIES.filter(c => c.gate !== person.trip.gate);
    const choices = [person.trip.gate];
    while (choices.length < 4) {
        const g = pick(others).gate;
        if (!choices.includes(g)) choices.push(g);
    }

    for (const gate of choices.sort(() => Math.random() - 0.5)) {
        const btn = document.createElement('button');
        btn.className = 'gate-btn';
        btn.textContent = gate;

        btn.addEventListener('click', () => {
            if (gate !== person.trip.gate) {
                mistakes++;
                mistakesEl.textContent = `❌ ${mistakes} mistakes`;
                btn.style.background = '#dc2626';
                gateQ.textContent = `Wrong gate! ${person.trip.city} is on the board. Look again.`;
                return;
            }

            boarded++;
            stampedEl.textContent = `✅ ${boarded} boarded`;
            toParisEl.textContent = `🗼 ${Math.min(boarded, NEEDED_TO_FLY)} / ${NEEDED_TO_FLY}`;

            gateQ.textContent = `Boarded! ${person.who.name} is off to ${person.trip.city}. 👋`;
            gateRow.querySelectorAll('button').forEach(b => b.disabled = true);
            confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 } });

            setTimeout(() => {
                // Shift over, so now you get to fly the plane yourself.
                if (boarded >= NEEDED_TO_FLY) startFlight();
                else nextPassenger();
            }, 1500);
        });

        gateRow.appendChild(btn);
    }

    gatePanel.classList.remove('hidden');
}


/* ============================================================
   FLYING THE PLANE
   Checklist, take off, steer, then land it gently.
   ============================================================ */

const TAKEOFF_SPEED = 150;   // fast enough to leave the ground
const LAND_FROM = 55;        // the gentle landing zone, matching .land-zone
const LAND_TO   = 81;

const flyScreen  = document.getElementById('fly-screen');
const flyTitle   = document.getElementById('fly-title');
const flyLabel   = document.getElementById('fly-label');
const skyEl      = document.getElementById('sky');
const planeYou   = document.getElementById('plane-you');
const runwayEl   = document.getElementById('runway');
const speedEl    = document.getElementById('speed');
const altEl      = document.getElementById('alt');
const starsEl    = document.getElementById('stars');
const checklist  = document.getElementById('checklist');
const flyControls= document.getElementById('fly-controls');
const pullUpBtn  = document.getElementById('pullup-btn');
const landPanel  = document.getElementById('land-panel');
const landFill   = document.getElementById('land-fill');

/* ============================================================
   THE AIRPORT SHUTTLE TRAIN
   You start at Terminal 1 and have to ride to your gate.
   ============================================================ */

// The stops, in the order the train visits them. It loops round at the end.
const STOPS = [
    { name: 'TERMINAL 1', gates: null },
    { name: 'TERMINAL 2', gates: null },
    { name: 'GATES A-B',  gates: ['A', 'B'] },
    { name: 'GATES C-D',  gates: ['C', 'D'] }
];

const trainScreen = document.getElementById('train-screen');
const trainEl     = document.getElementById('train');
const stationSign = document.getElementById('station-sign');
const trainLabel  = document.getElementById('train-label');
const trainGateEl = document.getElementById('train-gate');
const trainStopEl = document.getElementById('train-stopname');
const boardBtn    = document.getElementById('board-btn');
const getOffBtn   = document.getElementById('getoff-btn');
const youOnPlat   = document.getElementById('you-on-platform');

let myGate = 'A1';
let myStop = 2;          // which stop in STOPS is the right one
let atStop = 0;          // where the train is now
let onBoard = false;
let trainBusy = false;

function startTrain(afterwards) {
    trainAfter = afterwards;

    // Pick a gate, then work out which stop serves it.
    myGate = pick(['A1', 'A7', 'B4', 'B9', 'C2', 'C5', 'D3', 'D8']);
    myStop = STOPS.findIndex(s => s.gates && s.gates.includes(myGate[0]));

    trainGateEl.textContent = myGate;
    trainStopEl.textContent = STOPS[myStop].name;

    atStop = 0;
    onBoard = false;
    trainBusy = false;

    stationSign.textContent = STOPS[0].name;
    trainEl.style.left = '100%';
    trainEl.classList.remove('open');
    youOnPlat.classList.remove('aboard');
    getOffBtn.classList.add('hidden');
    boardBtn.classList.remove('hidden');
    boardBtn.disabled = true;

    startScreen.classList.remove('active');
    deskScreen.classList.remove('active');
    parisScreen.classList.remove('active');
    trainScreen.classList.add('active');

    trainLabel.textContent = 'The train is coming...';
    setTimeout(arriveAtStop, 1200);
}

let trainAfter = null;

// The train slides in, stops, and the doors open.
function arriveAtStop() {
    trainEl.style.left = '2%';
    trainBusy = true;

    setTimeout(() => {
        trainEl.classList.add('open');
        stationSign.textContent = STOPS[atStop].name;
        trainBusy = false;

        if (!onBoard) {
            boardBtn.disabled = false;
            trainLabel.textContent = 'Doors open! Get on the train. 🚪';
        } else {
            getOffBtn.classList.remove('hidden');
            trainLabel.textContent = `Now stopping at ${STOPS[atStop].name}. ` +
                (atStop === myStop ? 'This is your stop!' : 'Is this yours?');
        }
    }, 1700);
}

// Doors close and the train leaves for the next stop.
function leaveStop() {
    trainEl.classList.remove('open');
    trainBusy = true;
    trainLabel.textContent = 'Doors closing. Next stop...';

    setTimeout(() => {
        trainEl.style.left = '-320px';

        setTimeout(() => {
            atStop = (atStop + 1) % STOPS.length;
            trainEl.style.transition = 'none';
            trainEl.style.left = '100%';

            // Let the browser catch up before turning the sliding back on,
            // otherwise it animates the jump back to the right hand side.
            setTimeout(() => {
                trainEl.style.transition = '';
                arriveAtStop();
            }, 60);
        }, 1500);
    }, 900);
}

boardBtn.addEventListener('click', () => {
    if (trainBusy || onBoard) return;

    onBoard = true;
    boardBtn.disabled = true;
    boardBtn.classList.add('hidden');
    youOnPlat.classList.add('aboard');

    trainLabel.textContent = 'You are on board! Watch for your stop. 🚈';
    setTimeout(leaveStop, 1100);
});

getOffBtn.addEventListener('click', () => {
    if (trainBusy) return;

    if (atStop !== myStop) {
        trainLabel.textContent =
            `That's ${STOPS[atStop].name}, not yours! You need ${STOPS[myStop].name}. Stay on!`;
        getOffBtn.classList.add('hidden');
        setTimeout(leaveStop, 1400);
        return;
    }

    getOffBtn.classList.add('hidden');
    trainLabel.textContent = `🎉 ${STOPS[myStop].name}! Off you get, Captain. Gate ${myGate}.`;
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });

    setTimeout(() => {
        trainScreen.classList.remove('active');
        if (trainAfter) trainAfter();
    }, 1700);
});

// Staying on when it IS your stop should not strand you forever, so the
// train just comes back round.
setInterval(() => {
    if (trainScreen.classList.contains('active') && onBoard && !trainBusy
        && !getOffBtn.classList.contains('hidden')) {
        // Nothing to do, the player is deciding.
    }
}, 1000);


/* ============================================================
   DRIVING THE TRAIN
   You are the driver. Power, brake, and stop on the mark.
   ============================================================ */

/* The whole line: a THOUSAND terminals, then the gates at the far end.
   Building it with a loop rather than typing out a thousand names is the
   whole point of a loop. One line of code, a thousand stations. Change
   the 1000 and the whole line changes with it. */
const LINE = [];
for (let i = 1; i <= 1000; i++) LINE.push('TERMINAL ' + i);
LINE.push('GATES A-B', 'GATES C-D');

/* Trophies along the way. The number on the left is how many stops you
   have done, so 9 means you are pulling into Terminal 10. */
const MILESTONES = {
    9:    '🎉 TERMINAL 10! Ten stations done!',
    24:   '🏅 TERMINAL 25! Nice driving!',
    49:   '🔥 TERMINAL 50! Fifty stops!',
    99:   '🏆 TERMINAL 100! A HUNDRED STATIONS! 🏆',
    249:  '🥉 TERMINAL 250! A quarter of the whole line!',
    499:  '🥈 TERMINAL 500! HALFWAY DOWN THE LINE! 🥈',
    749:  '🥇 TERMINAL 750! Three quarters! Keep going!',
    899:  '⭐ TERMINAL 900! So close now!',
    999:  '🏆🏆🏆 TERMINAL 1000!! THE END OF THE LINE! 🏆🏆🏆'
};
const SPEED_LIMIT = 40;      // km/h on this line
const STOP_WINDOW = 6;       // metres either side of the mark that counts

/* A thousand passengers start on board, and your job is to get every one
   of them to their stop. Each station a group gets off and a smaller
   group gets on, so the number on board drops as you work down the line. */
const START_PAX = 1000;

const cabScreen  = document.getElementById('cab-screen');
const cabSpeedEl = document.getElementById('cab-speed');
const cabDistEl  = document.getElementById('cab-dist');
const cabLimitEl = document.getElementById('cab-limit');
const cabNextEl  = document.getElementById('cab-next');
const cabPaxEl   = document.getElementById('cab-pax');
const cabLabel   = document.getElementById('cab-label');
const platSign   = document.getElementById('plat-sign');
const trackStn   = document.getElementById('track-station');
const cabRail    = document.getElementById('cab-rail');
const driveWheel = document.getElementById('drive-wheel');
const powerLever = document.getElementById('power-lever');
const brakeLever = document.getElementById('brake-lever');
const stopMeter  = document.getElementById('stop-meter');
const stopNeedle = document.getElementById('stop-needle');
const signalEl   = document.getElementById('signal');
const swDoors    = document.getElementById('sw-doors');
const swHorn     = document.getElementById('sw-horn');
const swLights   = document.getElementById('sw-lights');
const doorsBtn   = document.getElementById('doors-btn');

let cabSpeed = 0, cabDist = 0, cabStop = 0;
let doorsOpen = true, lightsOn = false, driving = false;
let cabPax = 0, perfectStops = 0, cabTimer = null;
let delivered = 0;      // how many have reached their stop so far
let powerHeld = false, brakeHeld = false;

function startDriving() {
    startScreen.classList.remove('active');
    trainScreen.classList.remove('active');
    cabScreen.classList.add('active');

    cabStop = 0;
    cabPax = START_PAX;      // a full train to deliver
    delivered = 0;
    perfectStops = 0;
    doorsOpen = true;
    lightsOn = false;

    setDoors(true);
    swLights.classList.remove('on');
    updateDelivered();
    prepareRun();

    clearInterval(cabTimer);
    cabTimer = setInterval(cabTick, 60);
}

// Sets up the next leg of the journey.
function prepareRun() {
    const next = (cabStop + 1) % LINE.length;

    cabDist  = 900 + Math.floor(Math.random() * 500);
    cabSpeed = 0;
    driving  = false;

    cabNextEl.textContent = `Next: ${LINE[next]} (${next + 1}/${LINE.length})`;
    platSign.textContent  = LINE[next];
    cabPaxEl.textContent  = '👥 ' + cabPax;

    fillPlatform();
    drawRiders();
    trackStn.style.right = '-220px';
    stopMeter.classList.add('hidden');
    cabLabel.textContent = 'Doors are open. Close them to set off!';

    setSignal('red');
}

function setSignal(colour) {
    signalEl.querySelector('.red').classList.toggle('on', colour === 'red');
    signalEl.querySelector('.green').classList.toggle('on', colour === 'green');
}

/* ---------- Real people, on the platform and in your train ---------- */

const RIDER_FACES = ['🧍', '🧍‍♀️', '🧍‍♂️', '🧑', '👩', '👨', '👧', '👦', '👵',
                     '👴', '🧕', '🧑‍🦱', '👩‍🦰', '🧑‍💼', '👮', '🧑‍✈️'];

const stnPeopleEl = document.getElementById('stn-people');
const ridersEl    = document.getElementById('riders');
const cabDoorEl   = document.getElementById('cab-door');

let waitingCount = 0;

// Puts a crowd on the platform, waiting for you to arrive.
function fillPlatform() {
    waitingCount = 3 + Math.floor(Math.random() * 6);
    stnPeopleEl.innerHTML = '';

    for (let i = 0; i < waitingCount; i++) {
        const s = document.createElement('span');
        s.textContent = pick(RIDER_FACES);
        stnPeopleEl.appendChild(s);
    }
}

// Shows the people riding inside your train. Only the first few fit, which
// is fine, because it just needs to look busy.
function drawRiders() {
    ridersEl.innerHTML = '';
    const show = Math.min(6, Math.ceil(cabPax / 8));

    for (let i = 0; i < show; i++) {
        const s = document.createElement('span');
        s.textContent = pick(['🧍', '🧑', '👩', '👨']);
        ridersEl.appendChild(s);
    }
}

function setDoors(open) {
    doorsOpen = open;
    swDoors.classList.toggle('on', open);
    cabDoorEl.classList.toggle('open', open);
    doorsBtn.textContent = open ? '🚪 Close doors' : '🚪 Open doors';

    // Doors open at a station, so the crowd walks on board.
    if (open && cabSpeed < 0.6) {
        const boarding = stnPeopleEl.querySelectorAll('span');
        boarding.forEach((s, i) => {
            setTimeout(() => s.classList.add('boarding'), i * 160);
        });

        setTimeout(() => {
            // Only a few new people board, so the train empties over time.
            cabPax += waitingCount;
            cabPaxEl.textContent = '👥 ' + cabPax;
            drawRiders();
            cabLabel.textContent = `🚪 ${waitingCount} people got on. ${cabPax} on board now.`;
        }, boarding.length * 160 + 700);
    }
}

/* Runs many times a second. Everything that moves lives here. */
function cabTick() {
    // Power and brake only do anything once the doors are shut.
    if (driving) {
        if (powerHeld && !brakeHeld) cabSpeed += 0.9;
        if (brakeHeld)               cabSpeed -= 1.6;
        else if (!powerHeld)         cabSpeed -= 0.25;   // it coasts to a stop
    }

    cabSpeed = Math.max(0, Math.min(95, cabSpeed));

    // Distance shrinks based on how fast you are going.
    if (driving) cabDist = Math.max(0, cabDist - cabSpeed * 0.09);

    cabSpeedEl.textContent = Math.round(cabSpeed);
    cabDistEl.textContent  = Math.round(cabDist);
    cabLimitEl.textContent = SPEED_LIMIT;

    // Over the limit turns the speed red.
    cabSpeedEl.classList.toggle('over', cabSpeed > SPEED_LIMIT);

    // The wheel spins faster the quicker you go, and stops when you do.
    if (cabSpeed > 0.5) {
        driveWheel.style.animationPlayState = 'running';
        driveWheel.style.animationDuration = Math.max(0.35, 14 / cabSpeed) + 's';
    } else {
        driveWheel.style.animationPlayState = 'paused';
    }

    // The sleepers blur past faster too.
    cabRail.style.backgroundSize = Math.max(8, 22 - cabSpeed / 6) + 'px 10px';

    // The station slides into view over the last 220 metres.
    if (cabDist < 220) {
        stopMeter.classList.remove('hidden');
        const closeness = 1 - cabDist / 220;
        trackStn.style.right = (-220 + closeness * 300) + 'px';

        // The needle shows where you are against the mark. Middle is spot on.
        stopNeedle.style.left = Math.min(99, (1 - cabDist / 220) * 100) + '%';
    }

    // Stopped. Did you get it right?
    if (driving && cabSpeed < 0.6 && cabDist < 120) {
        cabSpeed = 0;
        driving = false;
        judgeStop();
    }

    // Rolled straight past the platform.
    if (driving && cabDist <= 0) {
        cabDist = 0;
        if (cabSpeed > 0.6) {
            cabLabel.textContent = '🚨 You overshot the platform! Brake harder next time.';
            cabSpeed = 0;
            driving = false;
            judgeStop();
        }
    }
}

function judgeStop() {
    const off = Math.round(cabDist);

    if (off <= STOP_WINDOW) {
        perfectStops++;
        cabLabel.textContent = `🎯 PERFECT STOP! Bang on the mark. (${off} m)`;
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } else if (off <= 30) {
        cabLabel.textContent = `👍 Good stop, ${off} m short. Open the doors.`;
    } else {
        cabLabel.textContent = `😬 You stopped ${off} m short of the mark.`;
    }

    setSignal('red');
    cabStop = (cabStop + 1) % LINE.length;

    // A big shout when you reach one of the landmark stations.
    if (MILESTONES[cabStop]) {
        cabLabel.textContent = MILESTONES[cabStop];
        confetti({ particleCount: 200, spread: 110, origin: { y: 0.6 } });
    }

    /* A group gets off here and reaches where they were going. Stopping
       right on the mark lines the doors up with the platform properly, so
       more of them can get off. That is why a perfect stop is worth it. */
    const bonus  = off <= STOP_WINDOW ? 1.5 : 1;
    const gotOff = Math.min(cabPax, Math.round((8 + Math.random() * 22) * bonus));

    cabPax    -= gotOff;
    delivered += gotOff;

    cabPaxEl.textContent = `👥 ${cabPax}`;
    updateDelivered();

    if (gotOff > 0) cabLabel.textContent += ` ${gotOff} got off here.`;

    // Everybody home. That is the whole job done.
    if (cabPax <= 0) {
        cabLabel.textContent =
            `🏆 ALL ${START_PAX} PASSENGERS DELIVERED! You did it, driver! 🏆`;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => confetti({
                particleCount: 220, spread: 120, origin: { y: 0.55 }
            }), i * 600);
        }
    }
}

// Shows how many of the thousand have made it to their stop.
function updateDelivered() {
    const pct = Math.round((delivered / START_PAX) * 100);
    document.getElementById('cab-line').textContent =
        `✅ ${delivered}/${START_PAX} delivered (${pct}%)`;
}

/* --- the controls --- */

function holdPower(on) {
    powerHeld = on;
    powerLever.style.top = on ? '28px' : '4px';   // the lever visibly moves
}

function holdBrake(on) {
    brakeHeld = on;
    brakeLever.style.top = on ? '28px' : '4px';
}

const powerBtn = document.getElementById('power-btn');
const brakeBtn = document.getElementById('brake-btn');

// Held down rather than clicked, like a real controller.
for (const [btn, fn] of [[powerBtn, holdPower], [brakeBtn, holdBrake]]) {
    btn.addEventListener('mousedown',  () => fn(true));
    btn.addEventListener('mouseup',    () => fn(false));
    btn.addEventListener('mouseleave', () => fn(false));
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); fn(true); },  { passive: false });
    btn.addEventListener('touchend',   (e) => { e.preventDefault(); fn(false); }, { passive: false });
}

doorsBtn.addEventListener('click', () => {
    if (cabSpeed > 0.6) {
        cabLabel.textContent = '🚫 You cannot open the doors while moving!';
        return;
    }

    setDoors(!doorsOpen);

    if (!doorsOpen) {
        // Doors shut, signal goes green, off you go.
        setSignal('green');
        driving = true;
        cabLabel.textContent = 'Signal green! Hold ⏫ Power to set off. 🚈';

        if (cabDist < 50) prepareRunSoon();
    } else {
        cabLabel.textContent = 'Doors open. Passengers getting on and off. 🚪';
    }
});

// After a stop, once you shut the doors, the next leg is set up.
function prepareRunSoon() {
    setTimeout(() => {
        prepareRun();
        setDoors(false);
        setSignal('green');
        driving = true;
        cabLabel.textContent = 'Signal green! Hold ⏫ Power to set off. 🚈';
    }, 300);
}

swHorn.addEventListener('click', () => {
    swHorn.classList.add('on');
    cabLabel.textContent = '📢 PAAARP! Mind the doors please!';
    setTimeout(() => swHorn.classList.remove('on'), 500);
});

swLights.addEventListener('click', () => {
    lightsOn = !lightsOn;
    swLights.classList.toggle('on', lightsOn);
    document.getElementById('track-view').style.filter =
        lightsOn ? 'brightness(1.15)' : '';
});

swDoors.addEventListener('click', () => doorsBtn.click());


/* ---------- The cabin ---------- */

/* Real airports you might be flying out of. Paris CDG is always where you
   are heading, because that is the whole point of the trip. */
const AIRPORTS = [
    { code: 'LHR', city: 'London' },   { code: 'JFK', city: 'New York' },
    { code: 'DUB', city: 'Dublin' },   { code: 'MAD', city: 'Madrid' },
    { code: 'AMS', city: 'Amsterdam' },{ code: 'FCO', city: 'Rome' }
];

const SEAT_FACES = {
    happy:   ['😀', '😊', '🥰', '😃', '🙂', '😌'],
    ok:      ['🙂', '😐', '😶', '🙂', '😊'],
    worried: ['😟', '😨', '😬', '😰', '🫣'],
    thrilled:['🤩', '😍', '🥳', '😁', '🙌']
};

const flightNoEl  = document.getElementById('flight-no');
const routeEl     = document.getElementById('flight-route');
const paxEl       = document.getElementById('flight-pax');
const cabinSeats  = document.getElementById('cabin-seats');
const cabinMood   = document.getElementById('cabin-mood');
const seatbeltEl  = document.getElementById('seatbelt-sign');

let passengers = 148;
let comfort = 80;        // how happy the cabin is, 0 to 100
let fromAirport = AIRPORTS[0];

/* The people actually in the seats. Twenty four of them, each with a name
   and a seat number, so hovering or tapping tells you who they are. */
const FIRST = ['Mia', 'Ben', 'Priya', 'Marcus', 'Rose', 'Alex', 'Sam', 'Ruby',
               'Kai', 'Ivy', 'Cal', 'Nova', 'Theo', 'Zara', 'Oscar', 'Lena',
               'Hugo', 'Nina', 'Felix', 'Iris', 'Dane', 'Suki', 'Otto', 'Wren'];
const LAST  = ['Rao', 'Bell', 'Kim', 'Stone', 'Fox', 'Ito', 'Osei', 'Wynn',
               'Sharpe', 'Reed', 'Vance', 'Frost', 'Hale', 'Moss', 'Vega', 'Quinn'];

let seatList = [];

function fillSeats() {
    seatList = [];
    for (let i = 0; i < 24; i++) {
        const row  = Math.floor(i / 4) + 1;
        const letter = 'ABCD'[i % 4];
        seatList.push({
            name: `${FIRST[i]} ${LAST[i % LAST.length]}`,
            seat: `${row}${letter}`
        });
    }
}

// Draws the rows of faces. Their expression comes from `comfort`, so the
// cabin visibly reacts to how you are flying.
function drawCabin() {
    const band = comfort >= 88 ? 'thrilled'
               : comfort >= 62 ? 'happy'
               : comfort >= 35 ? 'ok'
               : 'worried';

    const faces = SEAT_FACES[band];

    cabinSeats.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const person = seatList[i];
        const s = document.createElement('span');
        // Same seat always gets the same face within a band, so the cabin
        // does not flicker randomly every single frame.
        s.textContent = faces[i % faces.length];
        s.className = 'seat';
        s.title = `${person.name}, seat ${person.seat}`;

        // Tap a passenger and they say something about the flight.
        s.addEventListener('click', () => {
            const mood = comfort >= 62
                ? pick(['This is lovely!', 'Great flight!', 'So smooth!', 'Thank you, Captain!'])
                : comfort >= 35
                ? pick(['Are we nearly there?', 'Is it always this bumpy?', 'Ooh...'])
                : pick(['I feel sick!', 'Make it stop!', 'I want to get off!']);

            coPilot(`💺 ${person.name} in ${person.seat}: "${mood}"`);
        });

        cabinSeats.appendChild(s);
    }

    cabinMood.textContent = {
        thrilled: 'The cabin is loving it! 🥳',
        happy:    'Everyone is comfortable 😊',
        ok:       'A few people look nervous 😐',
        worried:  'The cabin is scared! 😰'
    }[band];
}

function comfortChange(amount) {
    comfort = Math.max(0, Math.min(100, comfort + amount));
    drawCabin();
}

function joltCabin() {
    cabinSeats.classList.remove('jolt');
    void cabinSeats.offsetWidth;
    cabinSeats.classList.add('jolt');
}

function setSeatbelt(on) {
    seatbeltEl.classList.toggle('on', on);
}

/* The PA. Whatever you say calms the cabin down a little, which is exactly
   what a real captain's announcement is for. */
const PA_LINES = [
    'Good afternoon everyone, this is your Captain speaking. ✈️',
    'We\'re cruising nicely. Sit back and enjoy the flight. ☁️',
    'Cabin crew, prepare for landing. 🛬',
    'Sorry about that bump, folks. Nothing to worry about. 🙂',
    'We should be in Paris right on time. 🗼',
    'The weather in Paris is lovely today. ☀️'
];

document.getElementById('pa-btn').addEventListener('click', () => {
    coPilot('📢 "' + pick(PA_LINES) + '"');
    comfortChange(7);
});


/* Your co-pilot. They sit beside you and call things out, which is what a
   real co-pilot does. They also warn you when a bird is lined up with you. */
const copilotEl   = document.getElementById('copilot');
const copilotSays = document.getElementById('copilot-says');
let lastWarned = 0;

function coPilot(text) {
    copilotSays.textContent = text;
    copilotEl.classList.remove('talking');
    void copilotEl.offsetWidth;          // forces the flash to replay
    copilotEl.classList.add('talking');
}

let phase = 'checklist';   // checklist, takeoff, cruise, landing
let speed = 0, alt = 0, stars = 0, bumps = 0;
let planeX = 50;           // across the sky, as a percent
let flyTimer = null, spawnTimer = null, landTimer = null, landBar = 0;
let checkStep = 0;

function startFlight() {
    deskScreen.classList.remove('active');
    flyScreen.classList.add('active');

    phase = 'checklist';
    speed = 0; alt = 0; stars = 0; bumps = 0; planeX = 50;
    checkStep = 0;

    speedEl.textContent = '0';
    altEl.textContent = '0';
    starsEl.textContent = '0';

    flyTitle.textContent = '✈️ Captain, you\'re flying!';
    flyLabel.textContent = 'Do the checklist in order, top left first.';

    checklist.classList.remove('hidden');
    flyControls.classList.add('hidden');
    pullUpBtn.classList.add('hidden');
    landPanel.classList.add('hidden');
    runwayEl.style.display = 'block';

    /* BUG FIX: taking off hides the throttle button, and nothing ever
       brought it back. On a second shift there was no way to speed up, so
       the plane could never leave the ground. Anything a round HIDES has
       to be un-hidden when the next round starts. */
    throttleBtn.classList.remove('hidden');

    // The runway stripes were left rushing past from last time too.
    runwayEl.style.backgroundSize = '100px 6px';

    // Stop any timers still running from a previous flight.
    clearInterval(flyTimer);
    clearInterval(spawnTimer);
    clearInterval(landTimer);

    planeYou.style.bottom = '26px';
    planeYou.style.left = '50%';
    planeX = 50;

    // Set up this flight: where from, how many on board, what it is called.
    fromAirport = pick(AIRPORTS);
    passengers  = 120 + Math.floor(Math.random() * 60);
    comfort     = 80;

    flightNoEl.textContent = 'TY ' + (100 + Math.floor(Math.random() * 900));
    routeEl.textContent    = `${fromAirport.code} → CDG`;
    paxEl.textContent      = `👥 ${passengers}`;

    setSeatbelt(true);
    fillSeats();
    drawCabin();

    coPilot(`${passengers} souls on board, ${fromAirport.city} to Paris. Ready, Captain.`);

    document.querySelectorAll('.check-btn').forEach(b => {
        b.classList.remove('done');
        b.disabled = false;
    });

    // Clear anything left flying about from last time.
    skyEl.querySelectorAll('.hazard, .starbit').forEach(e => e.remove());
}

/* --- the checklist --- */

document.querySelectorAll('.check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = Number(btn.dataset.step);

        // They have to be pressed in order, like a real checklist.
        if (step !== checkStep) {
            flyLabel.textContent = 'Not yet! Do them in order, left to right.';
            return;
        }

        btn.classList.add('done');
        btn.disabled = true;
        checkStep++;

        const said = ['Doors closed. 🚪', 'Engines running! 🔥',
                      'Flaps set. 🛫', 'Cleared for take off! 📻'][step];
        flyLabel.textContent = said;

        coPilot(['Doors closed and locked, Captain. 🚪',
                 'Engines are running sweet. 🔥',
                 'Flaps set for take off. 🛫',
                 'Tower says we\'re clear. Let\'s go! 📻'][step]);

        if (checkStep === 4) {
            phase = 'takeoff';
            checklist.classList.add('hidden');
            flyControls.classList.remove('hidden');
            flyLabel.textContent = `Hold 🔥 Throttle up until you reach ${TAKEOFF_SPEED}!`;
        }
    });
});

/* --- taking off --- */

const throttleBtn = document.getElementById('throttle-btn');

function throttle() {
    if (phase !== 'takeoff') return;

    speed += 14;
    speedEl.textContent = speed;

    // The runway stripes rush past faster as you speed up.
    runwayEl.style.backgroundSize = Math.max(30, 100 - speed / 3) + 'px 6px';

    // The co-pilot calls out the speed, the way they really do.
    if (speed >= TAKEOFF_SPEED) {
        pullUpBtn.classList.remove('hidden');
        flyLabel.textContent = 'Fast enough! PULL UP! 🛫';
        coPilot('V-ROTATE! Pull up now, Captain! 🛫');
    } else if (speed >= 100) {
        coPilot(`${speed} knots... nearly there!`);
    } else if (speed >= 40) {
        coPilot(`${speed} knots. Keep her rolling!`);
    }
}

throttleBtn.addEventListener('click', throttle);

pullUpBtn.addEventListener('click', () => {
    if (phase !== 'takeoff') return;

    phase = 'cruise';
    pullUpBtn.classList.add('hidden');
    throttleBtn.classList.add('hidden');
    runwayEl.style.display = 'none';

    planeYou.style.bottom = '110px';

    // Wheels up, so the seatbelt sign goes off and everyone relaxes.
    setSeatbelt(false);
    comfortChange(10);

    flyTitle.textContent = '☁️ Cruising to Paris';
    flyLabel.textContent = 'Steer with ◀ ▶. Catch ⭐, dodge 🦅 and ⛈️!';

    flyTimer  = setInterval(flyTick, 40);
    spawnTimer = setInterval(spawnThing, 750);

    // The flight lasts about twenty seconds, then it is time to land.
    setTimeout(beginLanding, 20000);
});

/* --- steering --- */

function steer(dir) {
    if (phase !== 'cruise') return;
    planeX = Math.max(8, Math.min(92, planeX + dir * 9));
    planeYou.style.left = planeX + '%';
    planeYou.style.transform = `translateX(-50%) rotate(${dir * 12}deg)`;
    setTimeout(() => planeYou.style.transform = 'translateX(-50%) rotate(0deg)', 160);
}

document.getElementById('left-btn').addEventListener('click',  () => steer(-1));
document.getElementById('right-btn').addEventListener('click', () => steer(1));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); steer(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); steer(1); }
});

/* --- things flying past --- */

function spawnThing() {
    if (phase !== 'cruise') return;

    const isStar = Math.random() < 0.5;
    const el = document.createElement('span');
    el.className = isStar ? 'starbit' : 'hazard';
    el.textContent = isStar ? '⭐' : pick(['🦅', '⛈️', '🎈', '🛸']);
    el.style.left = (8 + Math.random() * 84) + '%';
    el.style.top = '-30px';
    skyEl.appendChild(el);
}

function flyTick() {
    alt = Math.min(35000, alt + 90);
    altEl.textContent = alt.toLocaleString();

    for (const el of skyEl.querySelectorAll('.hazard, .starbit')) {
        const y = (parseFloat(el.style.top) || 0) + 5;
        el.style.top = y + 'px';

        // Off the bottom, so throw it away rather than letting hundreds
        // pile up in the page.
        if (y > 260) { el.remove(); continue; }

        /* The co-pilot spots a hazard lined up with you while it is still
           far off, and calls which way to turn. The lastWarned check stops
           them shouting every single frame. */
        const gap = parseFloat(el.style.left) - planeX;
        if (el.className === 'hazard' && y > 20 && y < 60 &&
            Math.abs(gap) < 12 && Date.now() - lastWarned > 1800) {

            lastWarned = Date.now();
            coPilot(gap >= 0 ? `${el.textContent} ahead! Go LEFT! ◀`
                             : `${el.textContent} ahead! Go RIGHT! ▶`);
        }

        /* Did it hit the plane?

           BUG FIX: this used to check y between 150 and 215, but the sky is
           250 tall and the plane sits 110 up from the bottom, so the plane
           really covers y 102 to 140 measuring down from the top. The old
           window was entirely BELOW the plane, so stars and birds passed
           straight through and only counted once they were past it.

           Measuring from the wrong end is an easy mistake. CSS `bottom`
           counts up, `top` counts down.

           SECOND FIX: those numbers used to be typed in as 250, 110 and 38.
           That worked until the wide screen layout made the sky 420 tall
           and moved the plane, and then nothing could be hit again. So now
           it ASKS the page how big things really are instead of assuming.
           Hard-coded sizes break the moment the layout changes. */
        const skyH        = skyEl.clientHeight;
        const planeH      = planeYou.offsetHeight;
        const planeUp     = parseFloat(getComputedStyle(planeYou).bottom) || 0;
        const planeTop    = skyH - planeUp - planeH;
        const planeBottom = skyH - planeUp;
        const hitY = y + 27 > planeTop && y < planeBottom;

        const near = Math.abs(parseFloat(el.style.left) - planeX) < 10 && hitY;
        if (!near) continue;

        if (el.className === 'starbit') {
            stars++;
            starsEl.textContent = stars;
            if (stars % 5 === 0) coPilot(`${stars} stars! You're on fire, Captain! ⭐`);
            comfortChange(2);          // smooth flying settles the cabin
        } else {
            bumps++;
            flyLabel.textContent = 'Bump! 😬 Steer around them!';
            skyEl.style.background = '#fca5a5';
            setTimeout(() => skyEl.style.background = '', 160);

            // The passengers feel every bump.
            comfortChange(-14);
            joltCabin();
            coPilot(pick(['Ouch! Watch out for those! 😬',
                          'That was a bump. Steady now. 🫣',
                          'Turbulence! Hold her level. 😖']));
        }
        el.remove();
    }
}

/* --- landing --- */

function beginLanding() {
    if (phase !== 'cruise') return;

    phase = 'landing';
    clearInterval(spawnTimer);
    clearInterval(flyTimer);
    skyEl.querySelectorAll('.hazard, .starbit').forEach(e => e.remove());

    flyControls.classList.add('hidden');
    landPanel.classList.remove('hidden');
    runwayEl.style.display = 'block';

    flyTitle.textContent = '🛬 Coming in to land';
    flyLabel.textContent = 'Press Touch down when the bar is in the GREEN!';
    coPilot('Paris in sight! Wait for the green, then touch down. 🗼');
    setSeatbelt(true);   // seatbelt sign back on for landing

    planeYou.style.bottom = '70px';

    landBar = 0;
    landTimer = setInterval(() => {
        landBar += 0.9;
        landFill.style.width = Math.min(100, landBar) + '%';
        planeYou.style.bottom = Math.max(26, 70 - landBar * 0.42) + 'px';

        if (landBar >= 100) {
            clearInterval(landTimer);
            finishLanding('hard');
        }
    }, 30);
}

document.getElementById('land-btn').addEventListener('click', () => {
    if (phase !== 'landing' || landBar >= 100) return;
    clearInterval(landTimer);

    finishLanding(landBar < LAND_FROM ? 'early'
                : landBar <= LAND_TO  ? 'smooth'
                : 'hard');
});

function finishLanding(how) {
    phase = 'done';
    planeYou.style.bottom = '26px';

    const said = {
        smooth: '🛬 A perfect landing! The passengers clapped! 👏',
        early:  '🛬 You came down too early and bounced. 😬',
        hard:   '🛬 Oof, a bumpy one. Everyone is fine though!'
    };

    flyLabel.textContent = said[how];
    coPilot({ smooth: 'Textbook landing, Captain! 👏', early: 'A bit early, but we are down. 😬', hard: 'Bumpy! Still, we made it. 🫣' }[how]);
    landPanel.classList.add('hidden');

    // The landing is what the passengers remember most.
    comfortChange({ smooth: 20, early: -12, hard: -22 }[how]);
    if (how !== 'smooth') joltCabin();

    if (how === 'smooth') confetti({ particleCount: 120, spread: 85, origin: { y: 0.6 } });

    landingQuality = how;
    setTimeout(goToParis, 2200);
}

let landingQuality = 'smooth';


/* ---------- Paris ---------- */

const PARIS_THINGS = [
    { emoji: '🗼', text: 'Eiffel Tower' },
    { emoji: '🥐', text: 'Croissant' },
    { emoji: '🎨', text: 'The Louvre' },
    { emoji: '🥖', text: 'Baguette' },
    { emoji: '☕', text: 'Café' },
    { emoji: '🧀', text: 'Cheese' },
    { emoji: '🚲', text: 'Bike ride' },
    { emoji: '🛥️', text: 'River boat' }
];

function goToParis() {
    deskScreen.classList.remove('active');
    flyScreen.classList.remove('active');
    parisScreen.classList.add('active');

    // Someone who skipped the desk gets a shorter write-up, since talking
    // about zero passengers would read oddly.
    document.getElementById('paris-text').textContent = boarded > 0
        ? `You checked in ${boarded} passengers with ${mistakes} mistake${mistakes === 1 ? '' : 's'}, ` +
          `then flew ${passengers} people from ${fromAirport.city} to Paris and caught ${stars} ⭐.`
        : `You flew ${passengers} passengers from ${fromAirport.city} all the way to Paris, ` +
          `Captain, and caught ${stars} ⭐ on the way.`;

    // What the cabin thought of the flight.
    const verdict = comfort >= 85 ? `👏 All ${passengers} passengers are applauding!`
                  : comfort >= 60 ? `😊 The passengers had a comfortable flight.`
                  : comfort >= 35 ? `😐 A few passengers looked a bit green.`
                  : `😰 That was a scary flight for everyone.`;

    const landed = {
        smooth: '🛬 A perfect landing.',
        early:  '🛬 A bouncy landing.',
        hard:   '🛬 A bumpy landing.'
    }[landingQuality];

    document.getElementById('paris-result').textContent = landed + ' ' + verdict;

    // Things to do in Paris. Each one can be clicked once.
    const things = document.getElementById('paris-things');
    things.innerHTML = '';

    for (const t of PARIS_THINGS) {
        const btn = document.createElement('button');
        btn.className = 'paris-thing';
        btn.innerHTML = t.emoji;
        btn.title = t.text;

        btn.addEventListener('click', () => {
            btn.innerHTML = t.emoji + ' ✓';
            btn.disabled = true;
            document.getElementById('paris-result').textContent = `${t.emoji} ${t.text}! Magnifique!`;
            confetti({ particleCount: 45, spread: 50, origin: { y: 0.75 } });
        });

        things.appendChild(btn);
    }

    for (let i = 0; i < 3; i++) {
        setTimeout(() => confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } }), i * 700);
    }
}


/* ---------- Go ---------- */

function startShift() {
    boarded = 0;
    mistakes = 0;
    stampedEl.textContent  = '✅ 0 boarded';
    mistakesEl.textContent = '❌ 0 mistakes';
    toParisEl.textContent  = `🗼 0 / ${NEEDED_TO_FLY}`;

    startScreen.classList.remove('active');
    parisScreen.classList.remove('active');
    deskScreen.classList.add('active');

    nextPassenger();
}

document.getElementById('start-btn').addEventListener('click', startShift);
document.getElementById('again-btn').addEventListener('click', startShift);

/* Straight to the cockpit, skipping the check-in desk. You still get a
   score at the end, it just starts from a clean sheet. */
/* Straight to flying: ride the shuttle train out to the gate, then take
   off. startTrain takes the thing to do once you get off. */
document.getElementById('fly-now-btn').addEventListener('click', () => {
    boarded = 0;
    mistakes = 0;
    startTrain(startFlight);
});

// The train on its own, without any of the rest.
document.getElementById('drive-btn').addEventListener('click', startDriving);

document.getElementById('train-only-btn').addEventListener('click', () => {
    startTrain(() => {
        trainScreen.classList.remove('active');
        startScreen.classList.add('active');
    });
});
