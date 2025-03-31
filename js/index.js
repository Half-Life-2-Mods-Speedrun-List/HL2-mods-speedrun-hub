const BACKEND_ROOT_URL = "http://localhost:3001"
import { Mods } from "./class/Mods.js"

const modifications = new Mods(BACKEND_ROOT_URL)
const div = document.createElement("div")
div.setAttribute("class", "gridlist")

let modsWithCategories = new Set()

const renderMod = (mod) => {
    const h4 = document.createElement("h4")
    h4.textContent = mod.getText()
    console.log(modsWithCategories)
    if (modsWithCategories.has(mod.getId())) {
        h4.style.color = "orange"
    }

    div.appendChild(h4)
    
}

const getMods = () => {
    modifications.getModsWithCategories()
    .then(data => data.forEach(obj => modsWithCategories.add(obj.id)))

    modifications.getMods().then((mods) => {
        mods.forEach(mod => {
            renderMod(mod)
            
        })
        document.body.appendChild(div)
    }).catch((error) => {
        alert(error)
    })
}
modifications.getModsWithCategories().then(data => console.log("Mods with categories:", data));
getMods()

