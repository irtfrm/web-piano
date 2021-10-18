const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
import { vigilate } from "/js/scores.js";
import { pure, pureLowerRe } from "/js/tones.js";
import { getTone, getTempo, getTonic } from "/js/inputs.js";

const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPeriodicFromWeights = (weights) => {
  const n = weights.length;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let i = 0; i < n; ++i) {
    real[i] = 0;
    imag[i] = weights[i];
  }
  return audioCtx.createPeriodicWave(real, imag);
};

const playFor = async (pitch, ms) => {
  const weights = [
    0, 0.8, 0.9, 0.9, 0.6, 0.3, 0.6, 0.2, 0.2, 0.17, 0.3, 0.05, 0.05, 0.05,
    0.15, 0.02, 0.08, 0.02, 0.06, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005,
    0.005, 0.005,
  ];
  const periodic = getPeriodicFromWeights(weights);

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.frequency.value = pitch;
  osc.connect(gainNode).connect(audioCtx.destination);
  osc.setPeriodicWave(periodic);

  osc.start();
  await wait(ms);
  osc.stop();
};

const playAt = (pitch) => {
  const weights = [
    0, 1, 0.9, 0.9, 0.6, 0.3, 0.6, 0.2, 0.2, 0.17, 0.3, 0.05, 0.05, 0.05,
    0.15, 0.02, 0.08, 0.02, 0.06, 0.01, 0.005, 0.005, 0.005, 0.005, 0.005,
    0.005, 0.005,
  ];
  const periodic = getPeriodicFromWeights(weights);

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.3;
  osc.frequency.value = pitch;
  osc.connect(gainNode).connect(audioCtx.destination);
  osc.setPeriodicWave(periodic);

  osc.start();
  return osc;
};

const stopOscs = (oscs) => {
  for (const osc of oscs) {
    osc.stop();
  }
};


document.querySelector("#play").addEventListener("click", async () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const tonic = getTonic();
  const tone = getTone();
  const tempo = getTempo();
  for (const note of vigilate) {
    await playFor(
      tone(tonic, note.degree),
      (note.duration * 60000) / 0.25 / tempo
    );
  }
});

document.querySelector("#pause").addEventListener("click", () => {
  oscillators[0].stop();
});

const keys = document.querySelectorAll(".key");

keys.forEach((key) => {
  key.addEventListener("mousedown", () =>
    playPiano(key.getAttribute("deg"), false)
  );
  key.addEventListener("mouseup", () => stopPiano(key.getAttribute("deg")));
  key.addEventListener("mouseout", () => stopPiano(key.getAttribute("deg")));
});

const was_key_down = {};
const keyboardMap = {
  q: 0,
  Q: 0,
  2: 1,
  '"': 1,
  w: 2,
  W: 2,
  3: 3,
  "#": 3,
  e: 4,
  E: 4,
  r: 5,
  R: 5,
  5: 6,
  "%": 6,
  t: 7,
  T: 7,
  6: 8,
  "&": 8,
  y: 9,
  Y: 9,
  7: 10,
  "'": 10,
  u: 11,
  U: 11,
  i: 12,
  I: 12,
  9: 13,
  ")": 13,
  o: 14,
  O: 14,
  0: 15,
  p: 16,
  P: 16,
  "@": 17,
  "`": 17,
  "^": 18,
  "~": 18,
  "[": 19,
  "{": 19,
  "\\": 20,
  "|": 20,
  "]": 21,
};
document.body.addEventListener("keydown", (event) => {
  if (event.key in keyboardMap && !(event.key in was_key_down)) {
    was_key_down[event.key] = true;
    playPiano(keyboardMap[event.key], event.key === "W" || event.key === "O");
  }
});
document.body.addEventListener("keyup", (event) => {
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

const pianoOscs = {};

function playPiano(degree, lowerRe) {
  if (degree in pianoOscs) stopOscs(pianoOscs[degree]);
  const tonic = getTonic();
  let tone = getTone();

  if (tone === pure && lowerRe) {
    tone = pureLowerRe;
  }
  pianoOscs[degree] = [playAt(tone(tonic, degree))];
}

function stopPiano(degree) {
  if (degree in pianoOscs) stopOscs(pianoOscs[degree]);
}
