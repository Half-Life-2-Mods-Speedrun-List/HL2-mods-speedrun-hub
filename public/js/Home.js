const bg = document.querySelector("#bg");
const goldsrc = document.querySelector("#goldsrc");
const goldsrc2 = document.querySelector("#goldsrc2");
const source = document.querySelector("#src");
const mods = document.querySelector("#mods");
const tut = document.querySelector("#tut");

let bgFull = 0.2;
let hoverTimer = null;
let lastUrl = "";

function delayedBg(url) {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
        bg.style.opacity = bgFull;
        bg.style.backgroundImage = `url(${url})`;
        lastUrl = url;
    }, 50);
}

function clearBg() {
    if (hoverTimer) clearTimeout(hoverTimer);
    bg.style.opacity = "0";
    setTimeout(() => { bg.style.backgroundImage = ""; }, 50);
}

goldsrc.addEventListener('mouseover', () => delayedBg("imgs/hl1_bg.jpg"));
goldsrc.addEventListener('mouseleave', clearBg);

goldsrc2.addEventListener('mouseover', () => delayedBg("imgs/hl1_bg.jpg"));
goldsrc2.addEventListener('mouseleave', clearBg);

source.addEventListener('mouseover', () => delayedBg("imgs/hl2_bg.jpg"));
source.addEventListener('mouseleave', clearBg);

mods.addEventListener('mouseover', () => delayedBg("imgs/hl2_mods_bg.jpg"));
mods.addEventListener('mouseleave', clearBg);

tut.addEventListener('mouseover', () => delayedBg("imgs/tut_bg.png"));
tut.addEventListener('mouseleave', clearBg);