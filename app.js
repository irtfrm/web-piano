const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const playAt = async (ord, ms) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 261.63 * Math.pow(octave, (1 / div) * ord );
    osc.connect(audioCtx.destination);
    osc.start();
    await wait(ms);
    osc.stop();
};
const div = 11;
const octave = 2;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const score = [0, 2, 4, 5, 7, 5, 4, 2, 0];

document.querySelector("#play").addEventListener("click", async () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    for (const note of score) {
        await playAt(note, 500);
    }
});

document.querySelector("#pause").addEventListener("click", () => {
    oscillators[0].stop();
});