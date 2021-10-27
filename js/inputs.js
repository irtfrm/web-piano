import { et, pure, pythagorean } from "/js/tones.js";
import { tonics } from "/js/tonics.js";
export const getTone = () => {
  const toneMap = {
    pure: pure,
    "12et": et,
    pythagorean: pythagorean,
  };
  let elements = document.getElementsByName("tone");

  let tone_name = "";
  for (const element of elements) {
    if (element.checked) {
      tone_name = element.value;
    }
  }
  return toneMap[tone_name];
};
export const getTonic = () => {
  return tonics[document.getElementById("tonic").value];
};
export const getTempo = () => {
  return document.getElementById("tempo").value;
};
export const getInstrumental = () => {
  return document.getElementById("instrumental").value;
};
export const getVolume = () => {
  return document.getElementById("volume").value;
};
