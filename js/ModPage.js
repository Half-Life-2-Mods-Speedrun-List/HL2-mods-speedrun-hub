
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
const renderCategory = (category) => {
    if (!category || !category.getText || !category.getId) {
        console.error("Invalid category data:", category);
        return;
    }

    const categoryDiv = document.createElement("div")
    const h2 = document.createElement("h2")
    h2.textContent = category.getText() 
    categoryDiv.appendChild(h2)
// class for styling
    categoryDiv.classList.add("category-div")
    const categoryContent = document.createElement("div");
    categoryContent.classList.add("category-content");
    categoryDiv.appendChild(categoryContent)

// add "View WR-history" btn
    const viewWRbtn = document.createElement("button")
    viewWRbtn.textContent = "View WR-history"
    categoryContent.appendChild(viewWRbtn)
    viewWRbtn.id = "wr-button"

    // event handler
    viewWRbtn.addEventListener("click", () => {
        openWRPopUp(category.getId())
    })

    document.body.appendChild(categoryDiv)


// Add speedrun div inside category-content div
 
}

// getting categories from backend and appending to the html-page
const getCategories = async (modId) => {
    const div = document.createElement("div")
    try {
        const result = await categories.getCategories(modId)
        console.log("Categories fetched:", result)
        div.innerHTML = ""; // clear previous categories so no duplicates will appear
        // If there are no categories
        if (!result || result.length === 0) {
            const noCategoriesMsg = document.createElement("p");
            noCategoriesMsg.textContent = "No categories available yet.";
            div.appendChild(noCategoriesMsg);
        } else { 
            result.forEach(category => {
            renderCategory(category)});
        }
        document.body.appendChild(div)
    } catch (error) {
        console.error("Error fetching category", error)
    }
}

// Fetch categories after adding a new one
const fetchCategoriesAfterAdd = async () => {
    await getCategories(modId);  // Fetch the updated categories list after a new one is added
}

const fetchCategories = async () => {
    try {
        await getCategories(modId);  // Fetch categories when the page is loaded
    } catch (error) {
        console.error("Error fetching categories:", error)
    }
}

if (modId) {
    fetchCategories();  // Fetch categories only if modId is valid
} else {
    console.error("ModId is missing in the url");
}

//fetchCategories();

const fetchWRHistory = async (categoryId, popUpContent) => {
    try {
        const response = await fetch (`${backendUrl}/wr-history/${categoryId}`)
        const wrData = await response.json()

        if (wrData.length === 0) {
            const noRecordsMsg = document.createElement("p")
            noRecordsMsg.textContent = "No World Records for this category yet."
            popUpContent.appendChild(noRecordsMsg)
        }
        else {
            const resultList = document.createElement("ul")
            // resultList.style.listStyleType = "none"; --> if bullet points aren't wanted?

            wrData.forEach(record => {
                const resultItem = document.createElement("li")
                resultItem.style.marginBottom = "10px" 
                resultItem.innerHTML = 
                `<strong>${record.runner_name}<strong> - Speedrun-time: ${record.record_time}<br>
                Date: ${record.record_date}`
                resultList.appendChild(resultItem)
            })
            popUpContent.appendChild(resultList)
        }
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

    try {
        const allCategories = await categories.getCategories(modId)
        const category = allCategories.find(category => category.getId() === categoryId)
        if (!category) {
            console.error("Category not found for id:", categoryId);
            return;
        }
        const categoryName = category.getText()
        const header = document.createElement("h3")
        header.textContent = `WR-history for category: ${categoryName}`
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
    } catch (error) {
        console.error("Error fetching categories:", error)
    }
}

// creating form and button for category adding
const addCategoryForm = document.createElement("form")
addCategoryForm.style.display = "none"; 
addCategoryForm.classList.add("category-form")
const categoryInput = document.createElement("input")
categoryInput.classList.add("category-input")
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
    console.log('Form is visibile now')
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
        console.log(`${backendUrl}/categories/${modId}`)
        // post-request to backend
        const response = await fetch(`${backendUrl}/categories/${modId}`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({category_name: newCategory})
        })
        if (response.ok) {
            const categoryData = await response.json()
            categoryInput.value = "" // clear input field
            addCategoryForm.style.display = "none"

            renderCategory(categoryData)
            await fetchCategoriesAfterAdd(); //refresh category-listing
            
        } else {
            console.error("Error adding category:" + response.statusText)
        }
    } catch (error) {
        console.error("Error adding category:", error)
    }
})

//getCategories();