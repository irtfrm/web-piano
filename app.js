const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillators = [];
for (let i = 0; i < 12; i++) {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 220 * Math.pow(2, i/12);
    osc.connect(audioCtx.destination);
    oscillators.push(osc);
}

document.querySelector("#play").addEventListener("click", async () => {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    for (const osc of oscillators) {
        osc.start();
        await wait(500);
        osc.stop();
        await wait(100);
    }
});

document.querySelector("#pause").addEventListener("click", () => {
    oscillators[0].stop();
});