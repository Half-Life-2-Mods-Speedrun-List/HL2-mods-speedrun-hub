const bg = document.querySelector("#bg");
const goldsrc = document.querySelector("#goldsrc");
const golsrc2 = document.querySelector("#goldsrc2");
const source = document.querySelector("#src");
const mods = document.querySelector("#mods");
const tut = document.querySelector("#tut");

let bgFull = 0.2

goldsrc.addEventListener('mouseover', () => {
    bg.style.opacity = bgFull;
    bg.style.backgroundImage = "url(imgs/hl1_bg.jpg)"
})

goldsrc.addEventListener('mouseleave', () => {
    bg.style.opacity = "0";
})

goldsrc2.addEventListener('mouseover', () => {
    bg.style.opacity = bgFull;
    bg.style.backgroundImage = "url(imgs/hl1_bg.jpg)"
})

goldsrc2.addEventListener('mouseleave', () => {
    bg.style.opacity = "0";
})

source.addEventListener('mouseover', () => {
    bg.style.opacity = bgFull;
    bg.style.backgroundImage = "url(imgs/hl2_bg.jpg)"
})

source.addEventListener('mouseleave', () => {
    bg.style.opacity = "0";
})

mods.addEventListener('mouseover', () => {
    bg.style.opacity = bgFull;
    bg.style.backgroundImage = "url(imgs/hl2_mods_bg.jpg)"
})

mods.addEventListener('mouseleave', () => {
    bg.style.opacity = "0";
})

tut.addEventListener('mouseover', () => {
    bg.style.opacity = bgFull;
    bg.style.backgroundImage = "url(imgs/tut_bg.png)"
})

tut.addEventListener('mouseleave', () => {
    bg.style.opacity = "0";
})