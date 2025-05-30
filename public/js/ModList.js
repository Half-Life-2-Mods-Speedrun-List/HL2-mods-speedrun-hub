import { Mods } from "./class/Mods.js"
import { frontendUrl, backendUrl } from "./config.js"

const modifications = new Mods(backendUrl)
const div = document.createElement("div")
div.setAttribute("class", "gridlist")

let modsWithCategories = new Set()
let allMods = []
const renderMod = (mod) => {
    const h4 = document.createElement("h4")
    h4.textContent = mod.getText()
    h4.title = mod.getText()
    if (modsWithCategories.has(mod.getId())) {
        h4.style.color = "orange"
    }
    h4.addEventListener("click",() => changePage(mod.getId()))
    div.appendChild(h4)
    
}

const changePage = (modId) => {
    console.log(modId)
    let url = new URL(`${frontendUrl}/views/ModPage.html`) 
    url.searchParams.append("id", modId)  
    window.location.href = url.toString()

    

}

const getMods = async () => {
    try {
        const modsWithCategoriesData = await modifications.getModsWithCategories();
        console.log("Mods with categories:", modsWithCategoriesData)
        modsWithCategoriesData.forEach(obj => {
            if(obj.category) {
            modsWithCategories.add(obj.id);
            }
        })    
        const mods = await modifications.getMods();
        allMods = mods;
        mods.forEach(mod => {
            renderMod(mod);
        });
        document.body.appendChild(div)
    } catch (error) {
        console.log(error)
    }
}

const filterMods = (searchInput) => {
    div.innerHTML = ""

    const filteredMods = allMods.filter(mod => 
        mod.getText().toLowerCase().includes(searchInput.toLowerCase())
    )

    filteredMods.forEach(mod => {
        renderMod(mod)
    })
}

const createSearchBar = () => {
    const searchBar = document.createElement("input")

    searchBar.setAttribute("type", "text")
    searchBar.style = "cursor: pointer"
    searchBar.classList.add("searchbar")
    searchBar.setAttribute("placeholder", "Search for mods")
    searchBar.addEventListener("input", (e) => {
        filterMods(e.target.value)
    })
    const navigationTable = document.querySelector(".box")

    navigationTable.appendChild(searchBar)


}
getMods()
createSearchBar()

