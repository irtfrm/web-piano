const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const mod = (m, n) => m >= 0 ? m % n : n + m % n
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
const et = (tonic, degree) => {
    return 	tonic * Math.pow(octave, (1 / div) * degree);
};
const pure = (tonic, degree) => {
    ratio = [1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
    return 	tonic * ratio[mod(degree, 12)] * (2 ** (Math.floor(degree / 12)));
};
const pureLowerRe = (tonic, degree) => {
    ratio = [1, 16/15, 10/9, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8];
    return 	tonic * ratio[mod(degree, 12)] * (2 ** (Math.floor(degree / 12)));
};

const playFor = async (pitch, ms) => {
    const oscs = [];
    const fundamental = pitch;
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

const playAt = (pitch) => {
    const oscs = [];
    const fundamental = pitch;
    const weights = [0.8, 0.9, 0.9, 0.6, 0.3, 0.6, 0.2, 0.2, 0.17, 0.3, 0.05, 0.05, 0.05, 0.15, 0.02, 0.08, 0.02, 0.06, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005, 0.005];
    const master = 0.02;

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
    return oscs;
};

const stopOscs = (oscs) => {
    for (const osc of oscs) {
        osc.stop();
    }
}

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
const getTonic = () => {
    return document.getElementById('tonic').value;
};
const getTempo = () => {
    return document.getElementById('tempo').value;
};
const div = 12;
const octave = 2;

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
    
    const tonic = getTonic();
    const tone = getTone();
    const tempo = getTempo();
    for (const note of vigilate) {
        await playFor(tone(tonic, note.degree), note.duration * 60000 / 0.25 / tempo);
    }
});

document.querySelector("#pause").addEventListener("click", () => {
    oscillators[0].stop();
});

const keys = document.querySelectorAll('.key');

keys.forEach(key=>{
  key.addEventListener('mousedown', ()=>playPiano(key.getAttribute('deg'), false));
  key.addEventListener('mouseup', ()=>stopPiano(key.getAttribute('deg')));
  key.addEventListener('mouseout', ()=>stopPiano(key.getAttribute('deg')));
});

const pianoOscs = {}
function playPiano(degree, lowerRe) {
  if (degree in pianoOscs)
    stopOscs(pianoOscs[degree]);
  const tonic = getTonic();
  let tone = getTone();

  if (tone === pure && lowerRe) {
      tone = pureLowerRe;
  }
  pianoOscs[degree] = playAt(tone(tonic, degree));
}

function stopPiano(degree) {
    if (degree in pianoOscs)
        stopOscs(pianoOscs[degree]);
}

was_key_down = {};
keyboardMap = {'q': 0, 'Q': 0, '2': 1, '"': 1, 'w': 2, 'W': 2, '3': 3, '#': 3, 'e': 4, 'E': 4, 'r': 5, 'R': 5, '5': 6, '%': 6, 't': 7, 'T': 7, '6': 8, '&': 8, 'y': 9, 'Y': 9, '7': 10, "'": 10, 'u': 11, 'U': 11, 'i': 12, 'I': 12, '9': 13, ')': 13, 'o': 14, 'O': 14, '0': 15, 'p': 16, 'P': 16, '@': 17, '`': 17, '^': 18, '~': 18, '[': 19, '{': 19, '\\': 20, '|': 20, ']': 21, }
document.body.addEventListener('keydown',
    event => {
        if (event.key in keyboardMap && !(event.key in was_key_down)) {
            was_key_down[event.key] = true;
            playPiano(keyboardMap[event.key], event.key==='W' || event.key==='O');
        }
});
document.body.addEventListener('keyup',
    event => {
        if (event.key in keyboardMap) {
            const myPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (!was_key_down[event.key]) {
                        resolve(keyboardMap[event.key]);
                        delete was_key_down[event.key];
                    }
                }, 20);
            });
            was_key_down[event.key] = false;
            myPromise.then(stopPiano);
        }
    });