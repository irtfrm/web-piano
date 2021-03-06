const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
import { vigilate } from "/js/scores.js";
import { pure, pureLowerRe, et } from "/js/tones.js";
import { getTone, getTempo, getTonic } from "/js/inputs.js";
import { organWeights, organ2Weights } from "/js/instruments.js";
import { getInstrumental } from "/js/inputs.js";
import { getVolume } from "/js/inputs.js";

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

const valueInstMap = {
  organ: getPeriodicFromWeights(organWeights),
  organ2: getPeriodicFromWeights(organ2Weights),
};

const playAt = (pitch, gain, wave) => {
  const attack = 0.04;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gain;
  osc.frequency.value = pitch;
  osc.connect(gainNode).connect(audioCtx.destination);
  osc.setPeriodicWave(wave);
  const startTime = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(
    gainNode.gain.value,
    startTime + attack
  );

  osc.start();
  return { osc: osc, gain: gainNode };
};

const stopOsc = (nodes) => {
  const osc = nodes.osc;
  const gainNode = nodes.gain;
  const release = 0.1;
  const stopTime = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(gainNode.gain.value, stopTime);
  gainNode.gain.linearRampToValueAtTime(0, stopTime + release);
  osc.stop(stopTime + release);
};

document.querySelector("#play").addEventListener("click", async () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const tonic = getTonic();
  const tone = getTone === pure ? pureLowerRe : et;
  const tempo = getTempo();
  const volume = getVolume();
  const wave = valueInstMap[getInstrumental()];

  const trackPointers = {};
  const trackOscs = {};
  const player = async (score, index) => {
    setTimeout(() => {
      if (index in trackOscs) {
        stopOsc(trackOscs[index]);
        removePushedClass(
          score[index][trackPointers[index]]["degree"] - tonic.shift
        );
        delete trackOscs[index];
      }
      trackPointers[index] += 1;
      if (trackPointers[index] < score[index].length) {
        let degree = score[index][trackPointers[index]]["degree"];
        if (degree !== null) {
          degree -= tonic.shift;
          addPushedClass(degree);
          trackOscs[index] = playAt(tone(tonic.hz, degree), volume, wave);
        }
        player(score, index);
      }
    }, (score[index][trackPointers[index]]["duration"] * 240000) / tempo);
  };
  for (const i in vigilate) {
    trackPointers[i] = 0;
    let degree = vigilate[i][trackPointers[i]]["degree"];
    if (degree !== null) {
      degree -= tonic.shift;
      addPushedClass(degree);
      trackOscs[i] = playAt(tone(tonic.hz, degree), volume, wave);
    }
    player(vigilate, i);
  }
});

// document.querySelector("#pause").addEventListener("click", () => {
//   organ.stop();
// });

const keys = document.querySelectorAll(".key");

keys.forEach((key) => {
  key.addEventListener("mousedown", () =>
    playPiano(key.getAttribute("deg"), false)
  );
  key.addEventListener("mouseup", () => stopPiano(key.getAttribute("deg")));
  key.addEventListener("mouseout", () => stopPiano(key.getAttribute("deg")));
  key.addEventListener("mouseout", () => stopPiano(key.getAttribute("deg")));
  key.addEventListener("touchstart", () =>
    playPiano(key.getAttribute("deg"), false)
  );
  key.addEventListener("touchend", () => stopPiano(key.getAttribute("deg")));
  key.addEventListener("touchcancel", () => stopPiano(key.getAttribute("deg")));
});

const addPushedClass = (degree) => {
  const piano = document.getElementById("piano");
  for (const child of piano.children) {
    if (degree == child.getAttribute("deg")) child.classList.add("pushed");
  }
};
const removePushedClass = (degree) => {
  const piano = document.getElementById("piano");
  for (const child of piano.children) {
    if (degree == child.getAttribute("deg")) child.classList.remove("pushed");
  }
};
const was_key_down = {};
const keyboardMap = {
  q: -7,
  Q: -7,
  2: -6,
  '"': -6,
  w: -5,
  W: -5,
  3: -4,
  "#": -4,
  e: -3,
  E: -3,
  4: -2,
  $: -2,
  r: -1,
  R: -1,
  t: 0,
  T: 0,
  6: 1,
  "&": 1,
  y: 2,
  Y: 2,
  7: 3,
  "'": 3,
  u: 4,
  U: 4,
  i: 5,
  I: 5,
  9: 6,
  ")": 6,
  o: 7,
  O: 7,
  0: 8,
  p: 9,
  P: 9,
  "-": 10,
  "=": 10,
  "@": 11,
  "`": 11,
  "[": 12,
  "{": 12,
  z: 12,
  Z: 12,
  s: 13,
  S: 13,
  x: 14,
  X: 14,
  d: 15,
  D: 15,
  c: 16,
  C: 16,
  v: 17,
  V: 17,
  g: 18,
  G: 18,
  b: 19,
  B: 19,
  h: 20,
  H: 20,
  n: 21,
  N: 21,
  j: 22,
  J: 22,
  m: 23,
  M: 23,
  ",": 24,
  "<": 24,
  l: 25,
  L: 25,
  ".": 26,
  ">": 26,
  ";": 27,
  "+": 27,
  "/": 28,
  "?": 28,
  _: 29,
};
document.body.addEventListener("keydown", (event) => {
  if (event.key in keyboardMap && !(event.key in was_key_down)) {
    was_key_down[event.key] = true;
    addPushedClass(keyboardMap[event.key]);
    playPiano(keyboardMap[event.key], event.key === "W" || event.key === "O");
  }
});
document.body.addEventListener("keyup", (event) => {
  if (event.key in keyboardMap) {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!was_key_down[event.key]) {
          resolve(keyboardMap[event.key]);
          removePushedClass(keyboardMap[event.key]);
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
  if (degree in pianoOscs) stopOsc(pianoOscs[degree]);
  const tonic = getTonic();
  let tone = getTone();
  const volume = getVolume();
  const wave = valueInstMap[getInstrumental()];

  if (tone === pure && lowerRe) {
    tone = pureLowerRe;
  }
  pianoOscs[degree] = playAt(
    tone(tonic.hz, degree - tonic.shift),
    volume,
    wave
  );
}

function stopPiano(degree) {
  if (degree in pianoOscs) stopOsc(pianoOscs[degree]);
}
