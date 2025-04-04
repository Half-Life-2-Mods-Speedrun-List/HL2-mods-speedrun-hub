
import { Categories } from "./class/Categories.js"
const backendUrl = "http://localhost:3001"

let params = new URLSearchParams(document.location.search);
let modId = params.get("id")

console.log("mod_id: " + modId)

const categories = new Categories(backendUrl)
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