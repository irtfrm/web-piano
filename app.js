const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const et = (degree) => {
    return 	196 * Math.pow(octave, (1 / div) * degree);
};
const pure = (degree) => {
    ratio = [1, 16/15, 10/9, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
    return 	196 * ratio[degree % 12] * (2 ** (Math.floor(degree / 12)));
};
const playAt = async (degree, ms, tone) => {
    const oscs = [];
    const fundamental = tone(degree);
    const weights = [0.8, 0.9, 0.9, 0.6, 0.3, 0.6, 0.2, 0.2, 0.17, 0.3, 0.05, 0.05, 0.05, 0.15, 0.02, 0.08, 0.02, 0.06, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005];
    const master = 0.04;

    i = 1;
    for (const weight of weights) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = weight * master;
        osc.type = 'sine';
        osc.frequency.value = fundamental * i;
        osc.connect(gainNode).connect(audioCtx.destination);
        oscs.push(osc);
        i++;
    }

    for (const osc of oscs) {
        osc.start();
    }
    await wait(ms);
    for (const osc of oscs) {
        osc.stop();
    }
};
const getTone = () => {
    let elements = document.getElementsByName('tone');

    let tone_name = '';
    for (const element of elements) {
        if (element.checked){
            tone_name = element.value;
        }
    }
    return tone_name === 'pure' ? pure : et;
};
const getTempo = () => {
    return document.getElementById('tempo').value;
};
const div = 12;
const octave = 2;
const tempo = 210;

const vigilate = [
    {
        "degree": 2,
        "duration": 0.75,
    },
    {
        "degree": 4,
        "duration": 0.25,
    },
    {
        "degree": 5,
        "duration": 0.75,
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
        "duration": 0.25,
    },
    {
        "degree": 9,
        "duration": 1,
    },

    {
        "degree": 4,
        "duration": 0.75,
    },
    {
        "degree": 6,
        "duration": 0.25,
    },
    {
        "degree": 7,
        "duration": 0.75,
    },
    {
        "degree": 6,
        "duration": 0.25,
    },
    {
        "degree": 7,
        "duration": 0.25,
    },
    {
        "degree": 9,
        "duration": 0.25,
    },
    {
        "degree": 11,
        "duration": 1,
    },

];

document.querySelector("#play").addEventListener("click", async () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    
    const tone = getTone();
    const tempo = getTempo();
    for (const note of vigilate) {
        await playAt(note.degree, note.duration * 60000 / 0.25 / tempo, tone);
    }
});

document.querySelector("#pause").addEventListener("click", () => {
    oscillators[0].stop();
});