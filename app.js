const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const playAt = async (degree, ms) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 261.63 * Math.pow(octave, (1 / div) * degree );
    osc.connect(audioCtx.destination);
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 261.63 * 2 * Math.pow(octave, (1 / div) * degree );
    osc2.connect(audioCtx.destination);

    osc.start();
    osc2.start();
    await wait(ms);
    osc.stop();
    osc2.stop();
};
const div = 12;
const octave = 2;
const tempo = 122;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const score = [
    {
        "degree": 0,
        "duration": 0.25,
    },
    {
        "degree": 2,
        "duration": 0.25,
    },
    {
        "degree": 4,
        "duration": 0.25,
    },
    {
        "degree": 5,
        "duration": 0.25,
    },
    {
        "degree": 7,
        "duration": 1,
    },
    {
        "degree": 7,
        "duration": 0.25,
    },
    {
        "degree": 5,
        "duration": 0.25,
    },
    {
        "degree": 4,
        "duration": 0.25,
    },
    {
        "degree": 2,
        "duration": 0.25,
    },
    {
        "degree": 0,
        "duration": 0.5,
    },
];

document.querySelector("#play").addEventListener("click", async () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    for (const note of score) {
        await playAt(note.degree, note.duration * 60000 / 0.25 / tempo);
    }
});

document.querySelector("#pause").addEventListener("click", () => {
    oscillators[0].stop();
});