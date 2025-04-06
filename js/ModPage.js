
import { Categories } from "./class/Categories.js"
import { Mods } from "./class/Mods.js"
const backendUrl = "http://localhost:3001"

let params = new URLSearchParams(document.location.search);
let modId = params.get("id")

if(!modId) {
    console.error("ModId is missing in the url")
}

console.log("mod_id: " + modId)

const categories = new Categories(backendUrl)
const mods = new Mods(backendUrl)

// function for showing categories
const renderCategory = (category, div) => {
    const h4 = document.createElement("h4")
    h4.textContent = category.getText() 
    div.appendChild(h4)
}

// getting categories from backend and appending to the html-page
const getCategories = async (modId) => {
    try {
        const div = document.createElement("div")
        const result = await categories.getCategories(modId)
        result.forEach(category => {
            renderCategory(category, div);
        });
        document.body.appendChild(div)
    } catch (error) {
        console.error("Error fetching category", error)
    }
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

// creating form and button for category adding
const addCategory = document.createElement("form")
const categoryInput = document.createElement("input")

categoryInput.type = "text"
categoryInput.placeholder = "Add new category"
categoryInput.required = true
const addCategoryBtn = document.createElement("button")
addCategoryBtn.type = "submit"
addCategoryBtn.textContent = "Add"

addCategory.appendChild(categoryInput)
addCategory.appendChild(addCategoryBtn)
document.body.appendChild(addCategory)

// adding category after submit
addCategory.addEventListener("submit", async (event) => {
    event.preventDefault()
    const newCategory = categoryInput.value
    if (newCategory === "") {
        return
    }
    try {
        console.log(`${backendUrl}/mods/${modId}/categories`)
        // post-request to backend
        const response = await fetch(`${backendUrl}/mods/${modId}/categories`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({category_name: newCategory, mod_id: modId})
        })
        if (response.ok) {
            categoryInput.value = "" // clear input field
            await getCategories(modId)
        } else {
            console.error("Error adding category:" + response.statusText)
        }
    } catch (error) {
        console.error("Error adding category:", error)
    }
})