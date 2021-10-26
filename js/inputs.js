import { et, pure } from "/js/tones.js";
import { tonics } from "/js/tonics.js";
export const getTone = () => {
  let elements = document.getElementsByName("tone");

  let tone_name = "";
  for (const element of elements) {
    if (element.checked) {
      tone_name = element.value;
    }
  }
  return tone_name === "pure" ? pure : et;
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
