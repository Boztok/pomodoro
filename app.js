const reset =document.querySelector('#reset') 
var intervalId

function startTimer(duration, display){
    var timer = duration, minutes, seconds;
    intervalId = setInterval(function (){
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        
        if(--timer < 0){
            clearInterval(intervalId);
            
        }
        console.log("inside" + intervalId)
    }, 1000);
    startButton.addEventListener('click', function () {
            curentTime = timer;     
    });  
}

var startButton;
var pomoDoroButton;
var sBreakButton;
var lBreakButton;

var curentState = 'pd';

var curentTime;
var pomoDoroTime;
var sBreakTime;
var lBreakTime;
var isTimerRunning;

var pomoDoroTimerInput;
var shortBreakTimerInput;
var longBreakTimerInput;
var longBreakIntervalInput;


var container = document.getElementById('main-container');

function TimerSetter(curentTime, stateName, display){
    clearInterval(intervalId);
    var minutes = parseInt(curentTime / 60, 10)
    var seconds = parseInt(curentTime % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    
    if(stateName !== ""){
        console.log(stateName)
        curentState = stateName;
        if(stateName ==="pd") container.style.backgroundColor = pomoDoroColor.value;
        else if(stateName ==="sb") container.style.backgroundColor = shortBreakColor.value;
        else if(stateName ==="lb") container.style.backgroundColor = longBreakColor.value;
    }
    nextButton.classList.remove('active');
    

    startButton.className = 's1';
    startButton.textContent = "START";
    isTimerRunning = false;
    
}
var display;
window.onload = function (){
    display = document.querySelector('#timer-string');
    startButton = document.getElementById('start');
    pomoDoroButton = document.getElementById('pomoDoro');
    sBreakButton = document.getElementById('sBreak');
    lBreakButton = document.getElementById('lBreak');
    
    pomoDoroTimerInput = document.getElementById('pomo-doro-time-input');
    shortBreakTimerInput = document.getElementById('short-break-time-input');
    longBreakTimerInput = document.getElementById('long-break-time-input');
    longBreakIntervalInput = document.getElementById('long-break-interval');

    pomoDoroColor = document.getElementById('pomodoro-color-input');
    shortBreakColor = document.getElementById('short-break-color-input');
    longBreakColor = document.getElementById('long-break-color-input');

    pomoDoroColor.value = "#f6bd60";
    shortBreakColor.value = "#f5cac3";
    longBreakColor.value = "#f28482";

    
    pomoDoroTime = 60 * 25;
    sBreakTime = 60 * 1;
    lBreakTime = 60 * 3;
    curentTime = pomoDoroTime;
    
    isTimerRunning = false;
    
    TimerSetter(curentTime, "pd", display);

    pomoDoroButton.addEventListener('click', function () {
        curentTime = pomoDoroTime;
        clearInterval(intervalId);
        isTimerRunning = false;
        TimerSetter(curentTime, "pd" , display);
    });
    sBreakButton.addEventListener('click', function () {
        curentTime = sBreakTime;
        clearInterval(intervalId);
        isTimerRunning = false;
        TimerSetter(curentTime, "sb", display);
    });

    lBreakButton.addEventListener('click', function () {
        curentTime = lBreakTime;
        clearInterval(intervalId);
        isTimerRunning = false;
        TimerSetter(curentTime, "lb", display);

    });

    startButton.addEventListener('click', function () {
        if(!isTimerRunning){
            startTimer(curentTime,display);
            startButton.className = 's2';
            startButton.textContent = "PAUSE";
            isTimerRunning = true;
            console.log("START")
            nextButton.classList.add('active');
        }
        else{
            
            console.log(intervalId)
            clearInterval(intervalId);
            intervalId = null;
            startButton.className = 's1';
            startButton.textContent = "START";
            isTimerRunning = false;
            nextButton.classList.remove('active');
            
        }
    });
    
    nextButton.addEventListener('click', function (){
        if(curentState === 'pd' ){ 
            if(pomoDoroCounter % longBreakInterval === 0 && pomoDoroCounter !== 0){ //if the user had x amount of break then the next break is a long break
                curentTime = lBreakTime;
                curentState = 'lb';
                clearInterval(intervalId);
                isTimerRunning = false;
                TimerSetter(curentTime, "lb", display);
                
                pomoDoroCounter++;
            }
            else{                               //else just a short break
                curentTime = sBreakTime;
                curentState = 'sb';
                clearInterval(intervalId);
                isTimerRunning = false;
                TimerSetter(curentTime, "sb", display);
            }
        }
        else if(curentState === 'sb'){ 
            curentTime = pomoDoroTime;
            curentState = 'pd';
            clearInterval(intervalId);
            isTimerRunning = false;
            TimerSetter(curentTime, "pd" , display);
            pomoDoroCounter++;
        }
        else{
            curentTime = pomoDoroTime;
            curentState = 'pd';
            clearInterval(intervalId);
            isTimerRunning = false;
            TimerSetter(curentTime, "pd" , display);                       
        }
        pomoDoroCounterText.textContent = "#"+pomoDoroCounter;
    });
};

const pomoDoroCounterText = document.querySelector('.pomoDoro-counter');
var pomoDoroCounter = 0;
var longBreakInterval = 4;

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const okModalButtons = document.querySelectorAll('[data-modal-ok-button]')
const overlay = document.getElementById('overlay')
const nextButton = document.getElementById('next')

var pomoDoroColor; 
var shortBreakColor; 
var longBreakColor; 

openModalButtons.forEach(button => {
    button.addEventListener('click', () =>{
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () =>{
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

okModalButtons.forEach(button => {
    button.addEventListener('click', () =>{
        const modal = button.closest('.modal')
        okModal();
        closeModal(modal);
    })
})

function okModal(){
    pomoDoroTime = pomoDoroTimerInput.value * 60;
    sBreakTime = shortBreakTimerInput.value * 60;
    lBreakTime = longBreakTimerInput.value * 60;
    longBreakInterval = longBreakIntervalInput.value;

    pomoDoroColor

    if(container.classList.contains('pd')){
        curentTime = pomoDoroTime;
        TimerSetter(pomoDoroTime,"pd",display);
        
    } 
    if(container.classList.contains('sb')){
        TimerSetter(sBreakTime,"sb",display);
        curentTime = sBreakTime;
    } 
    if(container.classList.contains('lb')){
        TimerSetter(lBreakTime,"lb",display);
        curentTime = lBreakTime;
    } 
}

function openModal(modal){
    if(modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
    pomoDoroTimerInput.value = pomoDoroTime/60;
    shortBreakTimerInput.value = sBreakTime/60;
    longBreakTimerInput.value = lBreakTime/60;
    longBreakIntervalInput.value = longBreakInterval;
    
}

function closeModal(modal){
    if(modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}




