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
            
        })
        document.body.appendChild(div)
    }).catch((error) => {
        alert(error)
    })
}


modifications.getModsWithCategories()
getMods()

