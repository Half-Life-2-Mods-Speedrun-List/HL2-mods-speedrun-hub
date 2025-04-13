
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

// Construct add resource link button
const addResourcesLink = document.createElement("td");
addResourcesLink.classList.add("nav-link")
addResourcesLink.textContent = "Add resources" // Replace this with an actual logo?
const navbar = document.querySelector(".navbar-items")
navbar.appendChild(addResourcesLink)

const fetchResourceLinks = async (modId) => {
    try {
        console.log("Fetching resource links for modId:", modId);
        const response = await fetch(`${backendUrl}/mods/${modId}/resourcelinks`);
        if (response.ok) {
            const resourceLinks = await response.json();
            return resourceLinks;
        } else if (response.status === 404) {
            console.log("No resource links set for this mod:", modId);
            return [];
        } else {
            throw new Error("Failed to fetch resource links");
        }
    } catch (error) {
        console.error("Error fetching resource links:", error);
        return [];
    }
};

const resourceLinksArray = await fetchResourceLinks(modId);
console.log("Fetched resource links:", resourceLinksArray);

const logosForLinks = [
    { pattern: /runthinkshootlive\.com/, imageSrc: "../imgs/rtsl.png" },
    { pattern: /moddb\.com/, imageSrc: "../imgs/moddb.png" },
    { pattern: /store.steampowered\.com/, imageSrc: "../imgs/steam.svg" },
    { pattern: /speedrun\.com/, imageSrc: "../imgs/src.svg" }
];

const defaultLogo = "../imgs/globe.png";

Object.entries(resourceLinksArray).forEach(([key, value]) => {
    if (value) {
        const resourceLinkContainer = document.createElement("td");

        // Find the matching logo
        const matchingLogo = logosForLinks.find(({ pattern }) => pattern.test(value));
        const imageSrc = matchingLogo ? matchingLogo.imageSrc : defaultLogo ;

        const logoImage = document.createElement("img");
        logoImage.src = imageSrc;
        logoImage.style.width = "1em";
        logoImage.style.height = "1em";

        const linkElement = document.createElement("a");
        linkElement.href = value;
        linkElement.target = "_blank"; // Open in a new tab
        linkElement.appendChild(logoImage);

        resourceLinkContainer.appendChild(linkElement);
        navbar.appendChild(resourceLinkContainer);
    }
});

// Add resources via a button in the navbar
// NOT YET IMPLEMENTED

// function for showing categories
const renderCategory = async (category) => {

    const categoryDiv = document.createElement("div")
    const h2 = document.createElement("h2")
    h2.textContent = category.getText() 
    categoryDiv.appendChild(h2)
// class for styling
    categoryDiv.classList.add("category-div")
    const categoryContent = document.createElement("div");
    categoryContent.classList.add("category-content");
    categoryDiv.appendChild(categoryContent)

// Add WR video box
    const videoBoxContainer = document.createElement("div");
    videoBoxContainer.classList.add("video-box-container");
    categoryContent.appendChild(videoBoxContainer);
    const videoBox = document.createElement("div");
    videoBox.classList.add("video-box");
    videoBoxContainer.appendChild(videoBox);

// Add "Add Video" elements
    const videoMissingText = document.createElement("p");
    videoMissingText.textContent = "Add a world record with the button below";
    videoMissingText.classList.add("video-missing-text");
    videoBox.appendChild(videoMissingText);
    const addVideoBtn = document.createElement("div");
    addVideoBtn.classList.add("add-video-btn");
    addVideoBtn.textContent = "+";
    videoBox.appendChild(addVideoBtn);

// add WR video if it exists in the database
    const fetchWRVideo = async (categoryId) => {
        try {
            const response = await fetch(`${backendUrl}/categories/${categoryId}/wr-video`);
            if (response.ok) {
                const wrVideo = await response.json();
                return wrVideo.wr_video;
            } else if (response.status === 404) {
                console.log("No WR video found for category:", categoryId);
                return null;
            } else {
                throw new Error("Failed to fetch WR video");
            }
        } catch (error) {
            console.error("Error fetching WR video:", error);
            return null;
        }
    };

// Fetch and display WR video if it exists
    const wrVideoUrl = await fetchWRVideo(category.getId());
    if (wrVideoUrl) {
        videoBox.innerHTML = ""; // Clear previous content
        const videoElement = document.createElement("iframe");
        videoElement.classList.add("video-iframe");
        videoElement.src = wrVideoUrl;
        videoElement.allowFullscreen = true;
        videoBox.appendChild(videoElement);
        addVideoBtn.textContent = "Edit video";
        addVideoBtn.classList.add("edit-video-btn");
        videoBoxContainer.appendChild(addVideoBtn);
    }

// Logic for adding a new WR video
    addVideoBtn.addEventListener("click", async () => {
        const videoUrl = prompt("Enter YouTube link to the video");
        if (videoUrl) {
            // Extract the video ID from the YouTube URL
            const videoId = extractYouTubeVideoId(videoUrl);
            if (videoId) {
                const videoElement = document.createElement("iframe");
                videoElement.classList.add("video-iframe");
                videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                videoElement.allowFullscreen = true;
                videoBox.innerHTML = ""; // Clear previous content
                videoBox.appendChild(videoElement);

                // Send the video URL to the backend
                console.log("Category ID:", category.getId());
                console.log("Video URL:", videoElement.src);
                try {
                    const result = await mods.createVideo(category.getId(), videoElement.src);
                    console.log("Video successfully added to the database:", result);
                } catch (error) {
                    console.error("Error adding video to the database:", error);
                }
            } else {
                alert("Invalid YouTube URL. Please enter a valid link.");
            }
        }
    });

    // Helper function to extract the video ID from a YouTube URL
    const extractYouTubeVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&\s]+)|youtu\.be\/([^&\s]+)/;
        const match = url.match(regex);
        return match ? match[1] || match[2] : null;
    };

// add "View WR-history" btn
    const viewWRbtn = document.createElement("button")
    viewWRbtn.textContent = "View WR-history"
    categoryContent.appendChild(viewWRbtn)
    viewWRbtn.id = "wr-button"

    // event handler
    viewWRbtn.addEventListener("click", () => {
        console.log("View WR-history button clicked")
        openWRPopUp(categoryDiv, category.getId())
    })
    return categoryDiv;
}

// getting categories from backend and appending to the html-page
const getCategories = async (modId) => {
    const div = document.createElement("div")
    const renderedCategories = []
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
            // Order categories by ID to prevent wrong order
            await Promise.all(
                result.map(async (category) => {
                    const categoryDiv = await renderCategory(category);
                    renderedCategories.push({ categoryId: category.getId(), categoryDiv });
                })
            );
            renderedCategories.sort((a, b) => a.categoryId - b.categoryId);
            renderedCategories.forEach(({ categoryDiv }) => {
                div.appendChild(categoryDiv);
            });
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
                resultItem.style.marginBottom = "5px" 
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
const openWRPopUp = async (categoryContent, categoryId) => {
    console.log("Opening WR pop-up for category:", categoryId)

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
        header.textContent = `WR-history for category ${categoryName}`
        popUpContent.appendChild(header)

        await fetchWRHistory(categoryId, popUpContent)

        const closeBtn = document.createElement("button")
        closeBtn.textContent = "Close"
        closeBtn.classList.add("close-btn")
        closeBtn.addEventListener("click", () => {
            categoryContent.removeChild(popUp)
        })

        popUpContent.appendChild(closeBtn)
        popUp.appendChild(popUpContent);
        categoryContent.appendChild(popUp)
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

// Creating the "Add category" option to the navbar
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
                "Content-Type":"application/json",
                credentials: "include"
            },
            body: JSON.stringify({category_name: newCategory })
        })
        if (response.ok) {
            const categoryData = await response.json()
            categoryInput.value = "" // clear input field
            addCategoryForm.style.display = "none"

            renderCategory(categoryData)
            await fetchCategoriesAfterAdd(); //refresh category-listing
            
            setTimeout(() => {
            scrollToCategory(categoryData.id)
        }, 300)
        } else if (response.status === 500) {
            alert("Category already exists")
        } else {
            alert("Error while adding the category. Please try again later.")
            console.error("Error adding category:" + response.statusText)
        }
    } catch (error) {
        console.error("Error adding category:", error)
    }

/* function to scroll to a newly added category  --> DOESN'T WORK YET
function scrollToCategory(categoryId) {
    console.log("categoryId in scrollToCategory:", categoryId);
    const categoryElement = document.getElementById(categoryId)
    if (categoryElement) {
        categoryElement.scrollIntoView({behavior: "smooth", block: "center"})
    } else {
        console.error("CategoryElement not found ", categoryId)
    }
} */
})



//getCategories();