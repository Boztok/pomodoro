const reset = document.querySelector('#reset');
let intervalId;

const startStopButton = document.querySelector('#start-button');
const pomoDoroButton = document.querySelector('#pomodoro-button');
const shortBreakButton = document.querySelector('#short-break-button');
const longBreakButton = document.querySelector('#long-break-button');

const STATES = {
	POMODORO: 'pd',
	SHORT_BREAK: 'sb',
	LONG_BREAK: 'lb',
};

let curentState = STATES.POMODORO;
const MINUTE = 60;

let curentTime;
let pomoDoroTime = 25 * MINUTE;
let shortBreakTime = 5 * MINUTE;
let longBreakTime = 15 * MINUTE;
let isTimerRunning;

const pomoDoroTimerInput = document.querySelector('#pomo-doro-time-input');
const shortBreakTimerInput = document.querySelector('#short-break-time-input');
const longBreakTimerInput = document.querySelector('#long-break-time-input');
const longBreakIntervalInput = document.querySelector('#long-break-interval');

const pomoDoroColor = document.querySelector('#pomodoro-color-input');
const shortBreakColor = document.querySelector('#short-break-color-input');
const longBreakColor = document.querySelector('#long-break-color-input');

const pomoDoroCounterText = document.querySelector('#pomoDoro-counter');
let pomoDoroCounter = 0;
let longBreakInterval = 4;

const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const okModalButtons = document.querySelectorAll('[data-modal-ok-button]');
const overlay = document.querySelector('#overlay');
const nextButton = document.querySelector('#next');

const container = document.querySelector('#main-container');
const display = document.querySelector('#timer-string');

function startTimer(duration, display) {
	let timer = duration,
		minutes,
		seconds;

	if (intervalId) {
		throw new Error('Interval already exists!');
	}
	intervalId = setInterval(() => {
		if (--timer <= 0) {
			changeState();
			clearInterval(intervalId);
			intervalId = null;
			return;
		}
		const timeToMinutesAndSeconds = (time) => [
			Math.floor(time / 60),
			time % 60,
		];
		[minutes, seconds] = timeToMinutesAndSeconds(timer);
		display.textContent =
			`${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0');
	}, 1000);
	startStopButton.addEventListener('click', () => {
		curentTime = timer;
	});
}

function setTimer(time, state, display = display) {
	clearInterval(intervalId);
	let timer = time,
		minutes,
		seconds;
	const timeToMinutesAndSeconds = (time) => [
		Math.floor(time / 60),
		time % 60,
	];
	[minutes, seconds] = timeToMinutesAndSeconds(timer);
	display.textContent =
		`${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0');

	curentState = state;
	switch (state) {
		case STATES.POMODORO:
			container.style.backgroundColor = pomoDoroColor.value;
			break;
		case STATES.SHORT_BREAK:
			container.style.backgroundColor = shortBreakColor.value;
			break;
		case STATES.LONG_BREAK:
			container.style.backgroundColor = longBreakColor.value;
			break;
		default:
			break;
	}
	nextButton.className = 'inactive';
	startStopButton.className = 'timer-stoped';
	startStopButton.textContent = 'START';
	isTimerRunning = false;
}

function changeState () {
	const handleNextState = (time, state) => {
		curentTime = time;
		//curentState = state;
		clearInterval(intervalId);
		intervalId = null;
		isTimerRunning = false;
		setTimer(time, state, display);
	};
	if (curentState === STATES.POMODORO) {
		if (
			pomoDoroCounter % longBreakInterval === 0 &&
			pomoDoroCounter !== 0
		) {
			handleNextState(longBreakTime, STATES.LONG_BREAK);
			pomoDoroCounter++;
		} else {
			handleNextState(shortBreakTime, STATES.SHORT_BREAK);
		}
	} else if (curentState === STATES.SHORT_BREAK) {
		handleNextState(pomoDoroTime, STATES.POMODORO);
		pomoDoroCounter++;
	} else {
		handleNextState(pomoDoroTime, STATES.POMODORO);
	}
	pomoDoroCounterText.textContent = '#' + pomoDoroCounter;
}

window.onload = function () {
	pomoDoroColor.value = '#f6bd60';
	shortBreakColor.value = '#f5cac3';
	longBreakColor.value = '#f28482';
	curentTime = pomoDoroTime;
	isTimerRunning = false;
	setTimer(curentTime, STATES.POMODORO, display);

	const setButtons = (button, targetState) => {
		button.addEventListener('click', ()=> {
			switch (targetState) {
				case STATES.POMODORO:
					curentTime = pomoDoroTime;
					break;
				case STATES.SHORT_BREAK:
					curentTime = shortBreakTime;
					break;
				case STATES.LONG_BREAK:
					curentTime = longBreakTime;
					break;
				default:
					break;
			}

			clearInterval(intervalId);
			intervalId = null;
			isTimerRunning = false;
			setTimer(curentTime, targetState, display);
		});
	};
	setButtons(pomoDoroButton, STATES.POMODORO);
	setButtons(shortBreakButton, STATES.SHORT_BREAK);
	setButtons(longBreakButton, STATES.LONG_BREAK);

	startStopButton.addEventListener('click', function () {
		if (!isTimerRunning) {
			startTimer(curentTime, display);
			startStopButton.className = 'timer-running';
			startStopButton.textContent = 'PAUSE';
			isTimerRunning = true;
			nextButton.className = 'active';
		} else {
			clearInterval(intervalId);
			intervalId = null;
			startStopButton.className = 'timer-stoped';
			startStopButton.textContent = 'START';
			isTimerRunning = false;
			nextButton.className = 'inactive';
		}
	});

	nextButton.addEventListener('click', changeState);
};

function okModal() {
	pomoDoroTime = pomoDoroTimerInput.value * MINUTE;
	shortBreakTime = shortBreakTimerInput.value * MINUTE;
	longBreakTime = longBreakTimerInput.value * MINUTE;
	longBreakInterval = longBreakIntervalInput.value;

	if (curentState === STATES.POMODORO) {
		curentTime = pomoDoroTime;
		setTimer(pomoDoroTime, STATES.POMODORO, display);
	}
	if (curentState === STATES.SHORT_BREAK) {
		curentTime = shortBreakTime;
		setTimer(shortBreakTime, STATES.SHORT_BREAK, display);	
	}
	if (curentState === STATES.LONG_BREAK) {
		curentTime = longBreakTime;
		setTimer(longBreakTime, STATES.LONG_BREAK, display);
	}
}

function openModal(modal) {
	if (modal == null) return;
	modal.classList.add('active');
	overlay.classList.add('active');
	pomoDoroTimerInput.value = pomoDoroTime / 60;
	shortBreakTimerInput.value = shortBreakTime / 60;
	longBreakTimerInput.value = longBreakTime / 60;
	longBreakIntervalInput.value = longBreakInterval;
}

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove('active');
	overlay.classList.remove('active');
}

openModalButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

closeModalButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modal = button.closest('.my-modal');
		closeModal(modal);
	});
});

okModalButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const modal = button.closest('.my-modal');
		okModal();
		closeModal(modal);
	});
});
