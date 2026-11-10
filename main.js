let input = document.getElementById("input");

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
function frequency(pitch){
    gainNode.gain.setValueAtTime(1, audio.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audio.currentTime);
    gainNode.gain.setValueAtTime(0, audio.currentTime + 1);
}

function handle(){
    audio.resume();
    var userinput = String(input.value);
    frequency(notename.get(userinput));
}