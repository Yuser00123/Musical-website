let input = document.getElementById("input");
let color =document.getElementById("color");
let volume = document.getElementById("volume-slider");
let lineWidth = document.getElementById("line-width");
var amplitude = 50;
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var x = 0;
var y = 0;
var freq = 0;
var counter = 0;
var interval = null;
var repeat = null;
var reset = false;
var length = 0;
var timepernote = 0;
var setting = null;
var recorder = null;
var blob = null;
var chunks = [];
let recordbtn = document.getElementById('record');

const audio = new AudioContext();
const gainNode = audio.createGain();
const oscillator = audio.createOscillator();

oscillator.type = "sine";
oscillator.connect(gainNode);
gainNode.connect(audio.destination);

gainNode.gain.value = 0;

const notename = new Map();

notename.set("C", 261.6);
notename.set("D", 293.7);
notename.set("E", 329.6);
notename.set("F", 349.2);
notename.set("G", 392.0);
notename.set("A", 440);
notename.set("B", 493.9);

oscillator.start();

function line(){
    ctx.strokeStyle = color.value;
    ctx.lineWidth = Number(lineWidth.value);
    y = height/2 - ((volume.value/100) * amplitude * Math.sin(freq * x * 2 * Math.PI * length * 0.5));
    ctx.lineTo(x, y);
    ctx.stroke();
    x += 1;
    counter += 1;

    if (counter > timepernote/20){
        clearInterval(interval);
    }
}

function drawSoundWave(){
    clearInterval(interval);
    counter = 0;

    if (reset){
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height/2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        reset = false;
    }
    interval = setInterval(line, 20);
}

function frequency(pitch){
    freq = pitch/10000;
    gainNode.gain.setValueAtTime(Number(volume.value)/100, audio.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audio.currentTime);
    setting = setInterval(() => {
        gainNode.gain.value = Number(volume.value)/100;
    }, 1);
    
    setTimeout(() => {
        clearInterval(setting);  
        gainNode.gain.value = 0;  
    }, Math.max(0, timepernote - 100));
}

function startRecording(){
    const canvasStream = canvas.captureStream(20);
    const combinedStream = new MediaStream();

    const audioDestination = audio.createMediaStreamDestination();
    gainNode.connect(audioDestination);

    canvasStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
    });

    audioDestination.stream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
    });
    
    chunks = [];
    recorder = new MediaRecorder(combinedStream);

    recorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    recorder.onstop = () => {
        blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "recording.webm";
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    };

    recorder.start();
}

function toggle(){
    if (recorder && recorder.state === "recording"){
        recorder.stop();
        recordbtn.innerText = "Start recording";
    } else {
        startRecording();
        recordbtn.innerText = "Stop recording";
    }
}

function handle(){
    reset = true;
    clearInterval(repeat);

    var userinput = String(input.value).toUpperCase();
    length = userinput.length;
    timepernote = 8000/length;
    var notelists = [];

    for(var i=0; i < userinput.length; i++){
        var note = userinput.charAt(i);
        var pitch = notename.get(note);

        if (pitch == undefined || pitch == ""){
            alert("Invalid note: " + note);
            return
        }
        notelists.push(pitch);
    }

    audio.resume();

    var j = 0;
    repeat = setInterval(() => {
        if (j < notelists.length) {
            frequency(Number(notelists[j]));
            drawSoundWave();
            j += 1;
        } else {
            clearInterval(repeat);
            repeat = null;
        }
    }, timepernote);
}