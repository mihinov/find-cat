const bg = document.querySelector('.bg');
const cat = document.querySelector('.cat');
const start = document.querySelector('.start');
const result = document.querySelector('.result');
const hint = document.querySelector('.hint');
const resultSpan = result.querySelector('span');
const pogresh = 100;
let heightWindow, widthWindow,
randomWidth, randomHeight,
leftCat, topCat, count, audio, findCatFlag;

audio = new Audio();

start.addEventListener('click', listenerStartClick);

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

function boolCat(num, clientX, clientY) {
	return (randomWidth < clientX + pogresh + num && randomWidth > clientX - pogresh - num) &&
		(randomHeight < clientY + pogresh + num && randomHeight > clientY - pogresh - num);
}

function playAudio(src) {
	audio.pause();
	audio.src = src;
	audio.currentTime = 0;
	audio.play();
}

function listenerWindowClick(event) {
	if (event.toElement == start ||
		event.toElement == result ||
		event.toElement == hint) {
		return false;
	}

	resultSpan.innerHTML = ++count + ' раз';
	const clientX = event.clientX;
	const clientY = event.clientY;

	if (findCatFlag == true) {
		findCatFlag = false;
		listenerStartClick(event);
	}

	if (boolCat(0, clientX, clientY)) {
		// console.log('вы попали');
		cat.style.transition = 'transform 0.3s linear';
		cat.style.transform = 'scale(1)';
		playAudio('audio/win.mp3');
		findCatFlag = true;
	} else {
		playAudio('audio/find1.mp3');
		hint.innerHTML = 'Холодрыга';
		hint.style.backgroundColor = '#0abdff';
	}
	if (boolCat(50, clientX, clientY)) {
		hint.innerHTML = 'Горячо';
		hint.style.backgroundColor = 'orange'
	} else if (boolCat(200, clientX, clientY)) {
		hint.innerHTML = 'Тепло';
		hint.style.backgroundColor = 'yellow'
	} else if (boolCat(400, clientX, clientY)) {
		hint.innerHTML = 'Холодно';
		hint.style.backgroundColor = '#83d0ea';
	}
}

function listenerStartClick(event) {
	hint.style.backgroundColor = 'white';
	cat.style.transition = '0s transform linear';
	cat.style.transform = 'scale(0)';
	event.target.style.backgroundColor = 'orange';
	event.target.addEventListener('transitionend', (e) => {
		if (e.target.style.cssText == 'background-color: orange;') {
			setTimeout(() => {
				e.target.style.backgroundColor = 'white';
			}, 125);
		}
	});
	boopMe();
	calcHeightAndWidthWindow();
	calcRandomHeightAndWidth();
	appearanceCat();
	count = 0;
	resultSpan.innerHTML = count + ' раз';
	hint.innerHTML = 'Подсказка';
	// console.log(randomHeight + ' randomHeight');
	// console.log(randomWidth + ' randomWidth');

	window.addEventListener('resize', function() {
		calcHeightAndWidthWindow();
		calcRandomHeightAndWidth();
		appearanceCat();
	});

	window.addEventListener('click', listenerWindowClick);
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