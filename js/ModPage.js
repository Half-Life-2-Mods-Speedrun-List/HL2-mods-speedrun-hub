
import { Categories } from "./class/Categories.js"
import { Mods } from "./class/Mods.js"
const backendUrl = "http://localhost:3001"

let params = new URLSearchParams(document.location.search);
let modId = params.get("id")

console.log("mod_id: " + modId)

const categories = new Categories(backendUrl)
const mods = new Mods(backendUrl)
const div = document.createElement("div")


const renderCategory = (category) => {
        const h4 = document.createElement("h4")
        h4.textContent = category.getText() 
        div.appendChild(h4)

}

const getCategories = async (modId) => {
    const result = await categories.getCategories(modId)
        result.forEach(category => {
            renderCategory(category);
        });
        document.body.appendChild(div)
}

getCategories(modId)



// Change <title> & <h2> to the mod's name
const changeTitle = async (modId) => {
    try {
        const allMods = await mods.getMods();
        const mod = allMods.find((mod) => mod.mod_id == modId);
        if (mod) {
            document.title = mod.mod_name;
            document.getElementById("modName").textContent = mod.mod_name;
        } else {
            console.error("Mod not found for id:", modId);
        }
    } catch (error) {
        console.error("Error fetching mod name:", error);
    }
};
changeTitle(modId)