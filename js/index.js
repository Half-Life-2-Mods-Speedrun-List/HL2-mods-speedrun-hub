const BACKEND_ROOT_URL = "http://localhost:3001"
import { Mods } from "./class/Mods.js"

const modifications = new Mods(BACKEND_ROOT_URL)

const div = document.createElement("div")
div.setAttribute("class", "gridlist")

const renderMod = (mod) => {
    const h4 = document.createElement("h4")
    h4.textContent = mod.getText()
    console.log(mod.getText())
    div.appendChild(h4)
    
}

const getMods = () => {
    console.log(modifications)
    modifications.getMods().then((mods) => {
        mods.forEach(mod => {
            console.log(mod)
            renderMod(mod)
            document.body.appendChild(div)
        })
    }).catch((error) => {
        alert(error)
    })
}

getMods()

// const bg = document.querySelector("#bg");
// const goldsrc = document.querySelector("#goldsrc");
// const source = document.querySelector("#src");
// const mods = document.querySelector("#mods");
// const tut = document.querySelector("#tut");

// let bgFull = 0.2

// goldsrc.addEventListener('mouseover', () => {
//     bg.style.opacity = bgFull;
//     bg.style.backgroundImage = "url(imgs/hl1_bg.jpg)"
// })

// goldsrc.addEventListener('mouseleave', () => {
//     bg.style.opacity = "0";
// })

// source.addEventListener('mouseover', () => {
//     bg.style.opacity = bgFull;
//     bg.style.backgroundImage = "url(imgs/hl2_bg.jpg)"
// })

// source.addEventListener('mouseleave', () => {
//     bg.style.opacity = "0";
// })

// mods.addEventListener('mouseover', () => {
//     bg.style.opacity = bgFull;
//     bg.style.backgroundImage = "url(imgs/hl2_mods_bg.jpg)"
// })

// mods.addEventListener('mouseleave', () => {
//     bg.style.opacity = "0";
// })

// tut.addEventListener('mouseover', () => {
//     bg.style.opacity = bgFull;
//     bg.style.backgroundImage = "url(imgs/tut_bg.png)"
// })

// tut.addEventListener('mouseleave', () => {
//     bg.style.opacity = "0";
// })