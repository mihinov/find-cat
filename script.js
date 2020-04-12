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
const heroes = body.querySelectorAll('.heroes');

const pogresh = 15; // Радиус кота
const lvl = 20; // Сколько кликать
let heightWindow, widthWindow,
randomWidth, randomHeight,
leftCat, topCat, count, audio, findCatFlag;
cat.style.maxWidth = Math.floor(pogresh * 2) + 'px';

maxClickCount.innerHTML = lvl;

audio = new Audio();

overlaySpan.addEventListener('click', function(e) {
	overlay.classList.remove('active');
	start__menu.classList.add('active');
});

start.addEventListener('click', function() {
	window.removeEventListener('click', listenerWindowClick);
	start__menu.classList.add('active');
});

start__game.addEventListener('click', function() {
	start__menu.classList.remove('active');
	listenerStartClick();
});

looz.addEventListener('click', function() {
	looz.classList.remove('active');
	listenerStartClick();
});

window.addEventListener('resize', appearanceCat);

function animationHeroes() {
	for (let i = 0; i < heroes.length; i++) {
		const str = 'anime' + (i+1) + ' 1s linear infinite alternate';
		heroes[i].style.animation = str;
	}
}

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
	calcHeightAndWidthWindow();
	calcRandomHeightAndWidth();
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
	return ((randomWidth < clientX + pogresh + num) &&
		(randomWidth > clientX - pogresh - num)) &&
		((randomHeight < clientY + pogresh + num) &&
		(randomHeight > clientY - pogresh - num));
}

function listenerWindowClick(event) {
	if (event.toElement == start ||
		event.toElement == result ||
		event.toElement == resultSpan ||
		event.toElement == maxClickCount) {
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

function listenerStartClick(event) { // начало игры
	animationHeroes();
	appearanceCat();
	cat.style.opacity = 1;
	boopMe();
	count = 0;
	resultSpan.innerHTML = count;
	setTimeout(function() {
		window.addEventListener('click', listenerWindowClick);
	}, 100);
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