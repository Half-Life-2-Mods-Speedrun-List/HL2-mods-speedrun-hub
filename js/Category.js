

const backendUrl = "http://localhost:3001"
let params = new URLSearchParams(document.location.search);
let modId = params.get("id")
console.log("mod_id: " + modId)

let categories = []
const div = document.createElement("div")

const getCategories = async (modId) => {
    const url = backendUrl + "/mods/categories/" + modId;
    try {
        const response = await fetch(url)
        const json = await response.json()
        categories = json
        console.log(categories)

        categories.forEach(category => {
            const h4 = document.createElement("h4")
            h4.textContent = category.category_name
            div.appendChild(h4)
        });
        document.body.appendChild(div)
    } catch (error) {
        console.error(error)
    }
}

getCategories(modId)