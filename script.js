const body = document.querySelector('body');
const bg = body.querySelector('.bg');
const cat = body.querySelector('.cat');
const start = body.querySelector('.start');
const hint = body.querySelector('.hint');
const result = body.querySelector('.result');
const resultSpan = result.querySelector('span');
const maxClickCount = result.querySelector('.maxClickCount');
const overlay = body.querySelector('.overlay');
const overlaySpan = overlay.querySelector('span');
const start__menu = body.querySelector('.start__menu');
const lvls = start__menu.querySelectorAll('.lvl'); // тут я получаю элементы .lvl
const looz = body.querySelector('.looz');
const pogresh = 60; // Радиус кота
let heightWindow, widthWindow,
randomWidth, randomHeight,
leftCat, topCat, count, audio, findCatFlag, lvl;

cat.style.maxWidth = Math.floor(pogresh * 2) + 'px';

audio = new Audio();

overlaySpan.addEventListener('click', function(e) {
	overlay.classList.remove('active');
	start__menu.classList.add('active');
	cat.style.transform = 'scale(0)'
	const randWidthPic = Math.floor(getRandomInt(0, widthWindow)/100) + 10;
	const randHeightPic = Math.floor(getRandomInt(0, heightWindow)/100) + 8;
	bg.style.backgroundImage = `url(https://picsum.photos/${randWidthPic}00/${randHeightPic}00)`;
});

// start.addEventListener('click', listenerStartClick);
start.addEventListener('click', function() {
	window.removeEventListener('click', listenerWindowClick);
	start__menu.classList.add('active');
});

for (let i = 0; i < lvls.length; i++) {
	const spanLvl = lvls[i].querySelector('span');
	spanLvl.addEventListener('click', function(e) {
		const parent = e.target.offsetParent;
		if (parent.classList.contains('master')) {
			lvl = 5;
		} else if (parent.classList.contains('middle')) {
			lvl = 10;
		} else if (parent.classList.contains('loser')) {
			lvl = 20;
		}
		maxClickCount.innerHTML = lvl;
		start__menu.classList.remove('active');
		listenerStartClick();
	});	
}

start.addEventListener('transitionend', function(e) {
	if (start.style.cssText == 'background-color: orange;' &&
		e.target.classList.contains('start')) {
		setTimeout(() => {
			e.target.style.backgroundColor = 'white';
		}, 125);
	}
});

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
	if (findCatFlag == true) {
		findCatFlag = false;
		return false;
	}
	count++;
	resultSpan.innerHTML = count;
	if (count == lvl) {
		window.removeEventListener('click', listenerWindowClick);
		playAudio('audio/looz.mp3');
		hint.style.backgroundColor = 'white';
		hint.innerHTML = 'Подсказка';
		looz.classList.add('active');
		return false;
	}
	const clientX = event.clientX;
	const clientY = event.clientY;

	if (boolCat(0, clientX, clientY)) {
		// console.log('вы попали');
		cat.style.transition = 'transform 0.3s linear';
		cat.style.transform = 'scale(1)';
		playAudio('audio/win.mp3');
		findCatFlag = true;
		overlay.classList.add('active');
		window.removeEventListener('click', listenerWindowClick);
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
	start.style.backgroundColor = 'orange';
	boopMe();
	calcHeightAndWidthWindow();
	calcRandomHeightAndWidth();
	appearanceCat();
	count = 0;
	resultSpan.innerHTML = count;
	hint.innerHTML = 'Подсказка';
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