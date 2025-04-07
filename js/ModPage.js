
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

// function for showing categories
const renderCategory = (category, div) => {
    const categoryDiv = document.createElement("div")
    const h4 = document.createElement("h4")
    h4.textContent = category.getText() 
    categoryDiv.appendChild(h4)
// class for styling
    categoryDiv.classList.add("category-div")
    const categoryContent = document.createElement("div");
    categoryContent.classList.add("category-content");
    categoryDiv.appendChild(categoryContent)

// add "View WR-history" btn
    const viewWRbtn = document.createElement("button")
    viewWRbtn.textContent = "View WR-history"
    categoryDiv.appendChild(viewWRbtn)
    viewWRbtn.id = "wr-button"

    // event handler
    viewWRbtn.addEventListener("click", () => {
        openWRPopUp(category.getId())
    })

    document.body.appendChild(categoryDiv)


/* Add speedrun div something like this inside category-content div
    const speedrunDiv = document.createElement("div");
    speedrunDiv.classList.add("speedrun");
    speedrunDiv.innerHTML = `
        <h3>Speedrun Category: ${category.getText()}</h3>
        <p>Speedrun details...</p>
    `;
    // this is important part so it gets located correctly
    categoryContent.appendChild(speedrunDiv);*/
}

// getting categories from backend and appending to the html-page
const getCategories = async (modId) => {
    const div = document.createElement("div")
    try {
        const result = await categories.getCategories(modId)
        div.innerHTML = "" // clear previous categories so no duplicates will appear
        result.forEach(category => {
            renderCategory(category, div);
        });
        document.body.appendChild(div)
    } catch (error) {
        console.error("Error fetching category", error)
    }
}

getCategories(modId)

const fetchWRHistory = async (categoryId, popUpContent) => {
    try {
        const response = await fetch (`${backendUrl}/wr-history?categoryId=${categoryId}`)
        const wrData = await response.json()

        const resultList = document.createElement("ul")
        wrData.forEach(record => {
            const resultItem = document.createElement("li")
            resultItem.textContent = `${record.runner_name} - Time: ${record.record_time}`
            resultList.appendChild(resultItem)
        })
        popUpContent.appendChild(resultList)
    } catch (error) {
        console.error("Error fetching WR history:", error)
    }
}

// function for showing the WR-history as pop-up
const openWRPopUp = async (categoryId) => {
    const popUp = document.createElement("div")
    popUp.classList.add("popUp") // for styling

    const popUpContent = document.createElement("div")
    popUpContent.classList.add("popUpContent")

    const header = document.createElement("h3")
    header.textContent = `WR-history for category: ${categoryId}`
    popUpContent.appendChild(header)

    await fetchWRHistory(categoryId, popUpContent)

    const closeBtn = document.createElement("button")
    closeBtn.textContent = "Close"
    closeBtn.classList.add("close-btn")
    closeBtn.addEventListener("click", () => {
        document.body.removeChild(popUp)
    })

    popUpContent.appendChild(closeBtn)
    popUp.appendChild(popUpContent);
    document.body.appendChild(popUp)
}


// creating form and button for category adding
const addCategoryForm = document.createElement("form")
addCategoryForm.style.display = "none"; 
const categoryInput = document.createElement("input")
categoryInput.type = "text"
categoryInput.placeholder = "Add new category"
categoryInput.required = true

const addCategoryBtn = document.createElement("button")
addCategoryBtn.type = "submit"
addCategoryBtn.textContent = "Add"
addCategoryBtn.classList.add("add-cat-btn")

addCategoryForm.appendChild(categoryInput)
addCategoryForm.appendChild(addCategoryBtn)
document.body.appendChild(addCategoryForm)

const addCategoryLink = document.getElementById("addCategory")
addCategoryLink.addEventListener("click", (event) => {
    event.preventDefault()
    // form comes visible
    addCategoryForm.style.display = "block"
})
// adding category after submit
addCategoryForm.addEventListener("submit", async (event) => {
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
            addCategoryForm.style.display = "none"
            //refresh category-listing
            await getCategories(modId)
        } else {
            console.error("Error adding category:" + response.statusText)
        }
    } catch (error) {
        console.error("Error adding category:", error)
    }
})