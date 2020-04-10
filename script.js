const body = document.querySelector('body');
const bg = body.querySelector('.bg');
const cat = body.querySelector('.cat');
const start = body.querySelector('.start');
const result = body.querySelector('.result');
const resultSpan = result.querySelector('span');
const maxClickCount = result.querySelector('.maxClickCount');
const overlay = body.querySelector('.overlay');
const overlaySpan = overlay.querySelector('span');
const start__menu = body.querySelector('.start__menu');
const start__game = body.querySelector('.start__game');
const looz = body.querySelector('.looz');
const pogresh = 20; // Радиус кота
let heightWindow, widthWindow,
randomWidth, randomHeight,
leftCat, topCat, count, audio, findCatFlag;
const lvl = 5;
cat.style.maxWidth = Math.floor(pogresh * 2) + 'px';

audio = new Audio();

overlaySpan.addEventListener('click', function(e) {
	overlay.classList.remove('active');
	start__menu.classList.add('active');
});

// start.addEventListener('click', listenerStartClick);
start.addEventListener('click', function() {
	window.removeEventListener('click', listenerWindowClick);
	start__menu.classList.add('active');
});

start__game.addEventListener('click', function() {
	maxClickCount.innerHTML = lvl;
	start__menu.classList.remove('active');
	listenerStartClick();
});

// for (let i = 0; i < lvls.length; i++) {
// 	const spanLvl = lvls[i].querySelector('span');
// 	spanLvl.addEventListener('click', function(e) {
// 		const parent = e.target.offsetParent;
// 		if (parent.classList.contains('master')) {
// 			lvl = 5;
// 		} else if (parent.classList.contains('middle')) {
// 			lvl = 10;
// 		} else if (parent.classList.contains('loser')) {
// 			lvl = 20;
// 		}
// 		maxClickCount.innerHTML = lvl;
// 		start__menu.classList.remove('active');
// 		listenerStartClick();
// 	});	
// }

looz.addEventListener('click', function() {
	start__menu.classList.add('active');
	looz.classList.remove('active');
});

window.addEventListener('resize', function() {
	calcHeightAndWidthWindow();
	calcRandomHeightAndWidth();
	appearanceCat();
});

function calcHeightAndWidthWindow() {
	heightWindow = document.body.clientHeight;
	widthWindow = document.body.clientWidth;
}

function calcRandomHeightAndWidth() {
	randomWidth = getRandomInt(pogresh, widthWindow - pogresh);
	randomHeight = getRandomInt(pogresh, heightWindow - pogresh);
}

function getRandomInt(min, max) {
	const rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

function appearanceCat() {
	leftCat = randomWidth - pogresh;
	topCat = randomHeight - pogresh;
	cat.style.top = topCat + 'px';
	cat.style.left = leftCat + 'px';
}

function playAudio(src) {
	audio.pause();
	audio.src = src;
	audio.currentTime = 0;
	audio.play();
}

function boolCat(num, clientX, clientY) {
	return (randomWidth < clientX + pogresh + num && randomWidth > clientX - pogresh - num) &&
		(randomHeight < clientY + pogresh + num && randomHeight > clientY - pogresh - num);
}

function listenerWindowClick(event) {
	if (event.toElement == start ||
		event.toElement == result) {
		return false;
	}
	if (findCatFlag == true) {
		findCatFlag = false;
		return false;
	}
	count++;
	resultSpan.innerHTML = count;
	if (count == lvl) {
		window.removeEventListener('click', listenerWindowClick);
		playAudio('audio/looz.mp3');
		looz.classList.add('active');
		return false;
	}
	const clientX = event.clientX;
	const clientY = event.clientY;

	if (boolCat(0, clientX, clientY)) {
		// console.log('вы попали');
		playAudio('audio/win.mp3');
		findCatFlag = true;
		overlay.classList.add('active');
		window.removeEventListener('click', listenerWindowClick);
	} else {
		playAudio('audio/find1.mp3');
	}
}

function listenerStartClick(event) {
	cat.style.opacity = 1;
	boopMe();
	calcHeightAndWidthWindow();
	calcRandomHeightAndWidth();
	appearanceCat();
	count = 0;
	resultSpan.innerHTML = count;
	setTimeout(function() {
		window.addEventListener('click', listenerWindowClick);
	}, 200);
	
}

function setupSynth() {
	window.synth = new Tone.Synth({
		oscillator: {
		type: 'sine',
		modulationFrequency: 1
	},
	envelope: {
		attack: 0,
		decay: 0.25,
		sustain: 0,
		release: 1
	}
	}).toMaster();
}
 
function boopMe() {
	if (!window.synth) {
		setupSynth();
	}

	window.synth.triggerAttackRelease(600, '9n');
}