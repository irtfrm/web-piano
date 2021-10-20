const div = 12;
const octave = 2;

const mod = (m, n) => (m >= 0 ? m % n : n + (m % n));

export const et = (tonic, degree) => {
  return tonic * Math.pow(octave, (1 / div) * degree);
};
export const pure = (tonic, degree) => {
  const ratio = [
    1,
    16 / 15,
    9 / 8,
    6 / 5,
    5 / 4,
    4 / 3,
    45 / 32,
    3 / 2,
    8 / 5,
    5 / 3,
    9 / 5,
    15 / 8,
  ];
  return tonic * ratio[mod(degree, 12)] * 2 ** Math.floor(degree / 12);
};
export const pureLowerRe = (tonic, degree) => {
  const ratio = [
    1,
    25 / 24,
    10 / 9,
    75 / 64,
    5 / 4,
    4 / 3,
    45 / 32,
    3 / 2,
    8 / 5,
    5 / 3,
    9 / 5,
    15 / 8,
  ];
  return tonic * ratio[mod(degree, 12)] * 2 ** Math.floor(degree / 12);
};
