let input = document.getElementById("input");

const audio = new AudioContext();
const gainNode = audio.createGain();
const oscillator = audio.createOscillator();

oscillator.type = "sine";
oscillator.connect(gainNode);
gainNode.connect(audio.destination);

gainNode.gain.value = 0;

oscillator.start();
function frequency(pitch){
    gainNode.gain.setValueAtTime(1, audio.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audio.currentTime);
    gainNode.gain.setValueAtTime(0, audio.currentTime + 1);
}

function handle(){
    audio.resume();
    frequency(input.value);
}