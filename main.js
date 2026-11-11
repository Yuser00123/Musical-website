let input = document.getElementById("input");
var amplitude = 40;
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var x = 0;
var y = 0;
var freq = 0;
var counter = 0;
var interval = null;

const audio = new AudioContext();
const gainNode = audio.createGain();
const oscillator = audio.createOscillator();

oscillator.type = "sine";
oscillator.connect(gainNode);
gainNode.connect(audio.destination);

gainNode.gain.value = 0;

notename = new Map();

notename.set("C", 261.6);
notename.set("D", 293.7);
notename.set("E", 329.6);
notename.set("F", 349.2);
notename.set("G", 392.0);
notename.set("A", 440);
notename.set("B", 493.9);

oscillator.start();

function line(){
    y = height/2 - (amplitude * Math.sin(freq * x));
    ctx.lineTo(x, y);
    ctx.stroke();
    x += 1;
    counter += 1;

    if (counter >= 50){
        clearInterval(interval);
    }
}

function drawSoundWave(){
    counter = 0;
    x = 0;
    y = height/2;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    interval = setInterval(line, 20);
}

function frequency(pitch){
    freq = pitch/10000;
    gainNode.gain.setValueAtTime(1, audio.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audio.currentTime);
    gainNode.gain.setValueAtTime(0, audio.currentTime + 1);
}

function handle(){
    audio.resume();
    var userinput = String(input.value);
    if (userinput != undefined && userinput != ""){
        frequency(notename.get(userinput));
        drawSoundWave();
    }
    else{
        alert("Please enter a valid note...");
    }
}