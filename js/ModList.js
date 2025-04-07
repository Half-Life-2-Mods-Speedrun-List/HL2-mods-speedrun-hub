const BACKEND_ROOT_URL = "http://localhost:3001"
import { Mods } from "./class/Mods.js"

const modifications = new Mods(BACKEND_ROOT_URL)
const div = document.createElement("div")
div.setAttribute("class", "gridlist")

let modsWithCategories = new Set()

const renderMod = (mod) => {
    const h4 = document.createElement("h4")
    h4.textContent = mod.getText()
    h4.title = mod.getText()
    if (modsWithCategories.has(mod.getId())) {
        h4.style.color = "orange"
        h4.style.cursor = "pointer"
    }
    h4.addEventListener("click",() => changePage(mod.getId()))
    div.appendChild(h4)
    
}

const changePage = (modId) => {
    console.log(modId)
    let url = new URL("http://localhost:5500/views/ModPage.html") 
    url.searchParams.append("id", modId)  
    window.location.href = url.toString()

    

}

const getMods = async () => {
    try {
        const modsWithCategoriesData = await modifications.getModsWithCategories();
        modsWithCategoriesData.forEach(obj => modsWithCategories.add(obj.id));

        const mods = await modifications.getMods();
        mods.forEach(mod => {
            renderMod(mod);
        });
        document.body.appendChild(div)
    } catch (error) {
        console.log(error)
    }
}

getMods()

