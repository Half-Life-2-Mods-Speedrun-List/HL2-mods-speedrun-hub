import { Categories } from "./class/Categories.js"
import { Mods } from "./class/Mods.js"
// const backendUrl = "http://localhost:3001"
const backendUrl = "https://hl2-speedrunhub-backend.onrender.com/"

let params = new URLSearchParams(document.location.search);
let modId = params.get("id")

if (!modId) {
    console.error("ModId is missing in the url")
}

console.log("mod_id: " + modId)

const categories = new Categories(backendUrl)
const mods = new Mods(backendUrl)

const hideExistingContent = () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");

    const categoriesDiv = document.getElementById("categories-container");
    const guideContainer = document.getElementById("guide-container");

    // Hide content based on the view parameter
    if (view === "tutorials" || view === "strategies") {
        if (categoriesDiv) {
            categoriesDiv.style.display = "none";
        }
    } else {
        if (guideContainer) {
            guideContainer.style.display = "none";
            strategiesButton.style.display = "none";
            tutorialsButton.style.display = "none";
        }
    }
};

// Buttons to create new guides
const strategiesButton = document.createElement("button");
strategiesButton.textContent = "Add a new strategy";
strategiesButton.classList.add("create-guide-btn");
strategiesButton.style.display = "none";

const tutorialsButton = document.createElement("button");
tutorialsButton.textContent = "Add a new tutorial";
tutorialsButton.classList.add("create-guide-btn");
tutorialsButton.style.display = "none";

// Append buttons to the page
document.body.appendChild(strategiesButton);
document.body.appendChild(tutorialsButton);

const loadGuides = async () => {
    const params = new URLSearchParams(window.location.search);
    const modId = params.get("id");
    const view = params.get("view");

    if (!modId) {
        console.error("Missing modId in URL parameters.");
        return;
    }
    if (view !== "tutorials" && view !== "strategies") {
        console.error("Invalid view parameter:", view);
        return;
    }

    try {
        const createNewGuide = async (type) => {
            try {
                const result = await mods.createNewGuide(modId, type);
                console.log(`Guide created successfully with ID: ${result.guide_id}`);
                await loadGuides();
            } catch (error) {
                console.error("Error creating guide:", error);
                if (error.message === "Access token is missing") {
                alert("Unauthorized access. Please log in.");
                } else {
                alert("An error occurred while creating the guide.");
                }
            }
        };
        
    
        if (view === "strategies") {
            strategiesButton.style.display = "block";
            tutorialsButton.style.display = "none";
        } else if (view === "tutorials") {
            strategiesButton.style.display = "none";
            tutorialsButton.style.display = "block";
        } else {
            strategiesButton.style.display = "none";
            tutorialsButton.style.display = "none";
        }

        strategiesButton.addEventListener("click", () => createNewGuide(1));
        tutorialsButton.addEventListener("click", () => createNewGuide(2));

        const guides = await mods.getGuides(modId, view);
        console.log("Fetched guides:", guides);

        // Get or create the guide container
        let guideContainer = document.getElementById("guide-container");
        if (!guideContainer) {
            guideContainer = document.createElement("div");
            guideContainer.id = "guide-container";
            document.body.appendChild(guideContainer);
        }


        // Clear the guide container
        guideContainer.innerHTML = "";

        // Render the guides
        guides.forEach((guide) => {

            const type = view === "strategies" ? 1 : view === "tutorials" ? 2 : null;

            const guideElement = document.createElement("div");
            guideElement.classList.add("guide");

            // Add video box
            const videoBoxContainer = document.createElement("div");
            videoBoxContainer.classList.add("video-box-container");
            guideElement.appendChild(videoBoxContainer);
            const videoBox = document.createElement("div");
            videoBox.classList.add("video-box");
            videoBoxContainer.appendChild(videoBox);

            // Add "Add Video" elements
            const videoMissingText = document.createElement("p");
            videoMissingText.textContent = "Add a video with the button below";
            videoMissingText.classList.add("video-missing-text");
            videoBox.appendChild(videoMissingText);
            const addGuideVideoBtn = document.createElement("div");
            addGuideVideoBtn.classList.add("add-video-btn");
            addGuideVideoBtn.textContent = "+";
            videoBox.appendChild(addGuideVideoBtn);

            // Add YouTube video iframe if the guide has a video
            if (guide.video) {
                videoBox.innerHTML = ""; // Clear previous content
                const videoElement = document.createElement("iframe");
                videoElement.classList.add("video-iframe");
                videoElement.src = guide.video; // Ensure the video URL is in an embeddable format
                videoElement.allowFullscreen = true;
                videoElement.setAttribute("crossorigin", "anonymous");
                videoElement.setAttribute("credentialless", true);
                videoBox.appendChild(videoElement);

                addGuideVideoBtn.textContent = "Edit video";
                addGuideVideoBtn.classList.add("edit-video-btn");
                videoBoxContainer.appendChild(addGuideVideoBtn);
            }
        


    // Logic for adding a new video
    addGuideVideoBtn.addEventListener("click", async () => {
        const videoUrl = prompt("Enter YouTube link to the video");
        if (videoUrl) {
            // Extract the video ID from the YouTube URL
            const videoId = extractYouTubeVideoId(videoUrl);
            if (videoId) {
                try {

                    const response = await mods.createGuideVideo(modId, `https://www.youtube.com/embed/${videoId}`, guide.guide_id, type);

                    if (response.ok) {
                        const result = await response.json();
                        console.log("Video successfully added to the database:", result);

                        // Update the UI only if the backend confirms success
                        const videoElement = document.createElement("iframe");
                        videoElement.classList.add("video-iframe");
                        videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                        videoElement.allowFullscreen = true;
                        videoBox.innerHTML = ""; // Clear previous content
                        videoBox.appendChild(videoElement);
                    } else {
                        const errorData = await response.json();
                        console.error("Error adding video to the database:", errorData);
                        alert(errorData.message || "Failed to update the video. Please try again.");
                    }
                } catch (error) {
                    if (error.message === "Access token is missing") {
                        alert("Unauthorized access. Please log in.");
                    } else {
                    console.error("Error adding video to the database:", error);
                    alert("An error occurred while updating the video. Please try again.");
                    }
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

            // Add image if the guide has one
            if (guide.image) {
                const imageElement = document.createElement("img");
                imageElement.src = guide.image;
                imageElement.alt = "Guide Image";
                guideElement.appendChild(imageElement);
            }

            // Add description
            const guideDescriptionContainer = document.createElement("div");
            guideDescriptionContainer.classList.add("guide-description-container");

            const guideDescription = document.createElement("p");
            guideDescription.classList.add("guide-description");
            guideDescription.textContent = guide.description || "No description available";
            guideDescriptionContainer.appendChild(guideDescription);

            const editDescriptionBtn = document.createElement("div");
            editDescriptionBtn.textContent = "Edit";
            editDescriptionBtn.classList.add("edit-description-btn");
            guideDescriptionContainer.appendChild(editDescriptionBtn);

            editDescriptionBtn.addEventListener("click", () => {
                // Replace description with an input box
                const descriptionInput = document.createElement("textarea");
                descriptionInput.value = guide.description || "";
                descriptionInput.classList.add("description-input");
                descriptionInput.setAttribute("maxlength", 750);

                const charCounter = document.createElement("div");
                charCounter.classList.add("char-counter");
                charCounter.textContent = `${750 - descriptionInput.value.length} characters remaining`;
            
                descriptionInput.addEventListener("input", () => {
                    const remaining = 750 - descriptionInput.value.length;
                    charCounter.textContent = `${remaining} characters remaining`;
                });

                guideDescriptionContainer.innerHTML = "";
                guideDescriptionContainer.appendChild(descriptionInput);
                guideDescriptionContainer.appendChild(charCounter);

                const saveDescriptionBtn = document.createElement("div");
                saveDescriptionBtn.textContent = "Save";
                saveDescriptionBtn.classList.add("save-description-btn");
                guideDescriptionContainer.appendChild(saveDescriptionBtn);

                saveDescriptionBtn.addEventListener("click", async () => {
                    const newDescription = descriptionInput.value.trim();
                    if (newDescription === guide.description) {
                        // If the description hasn't changed, revert to the original view
                        guideDescriptionContainer.innerHTML = "";
                        guideDescription.textContent = guide.description || "No description available";
                        guideDescriptionContainer.appendChild(guideDescription);
                        guideDescriptionContainer.appendChild(editDescriptionBtn);
                        return;
                    }

                    try {
                        const response = await mods.updateGuideDescription(modId, guide.guide_id, newDescription, type);
                        if (response.ok) {
                            console.log("Description updated successfully.");
                            guide.description = newDescription;
                            guideDescription.textContent = newDescription || "No description available";
                        } else {
                            console.error("Failed to update description:", await response.json());
                            alert(errorData.message || "Failed to update the description. Please try again.");
                        }
                    } catch (error) {
                        if (error.message === "Access token is missing") {
                            alert("Unauthorized access. Please log in.");
                        } else {
                        console.error("Error updating description:", error);
                        alert("An error occurred while updating the description.");
                        }
                    }

                    // Revert to the original view
                    guideDescriptionContainer.innerHTML = "";
                    guideDescriptionContainer.appendChild(guideDescription);
                    guideDescriptionContainer.appendChild(editDescriptionBtn);
                });
            });

            guideElement.appendChild(guideDescriptionContainer);

            guideContainer.appendChild(guideElement);
        });

        guideContainer.style.display = "block";
    } catch (error) {
        console.error("Error fetching or rendering guides:", error);
    }
};

// Load guides when opening the page
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");

    hideExistingContent();

    if (view === "tutorials" || view === "strategies") {
        await loadGuides();
    } else {
        showCategories();
        await fetchCategories();
    }
});


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

const navbar = document.querySelector(".navbar");
const resourcesFlex = document.createElement("div");
resourcesFlex.classList.add("resources-flex");
navbar.appendChild(resourcesFlex);

// Construct add resource link button
const addResources = document.createElement("div");
addResources.classList.add("nav-link");
const addResourcesImg = document.createElement("img");
addResourcesImg.src = "../imgs/plus.png";
addResourcesImg.style.width = "1.5em";
addResourcesImg.style.height = "1.5em";
addResources.appendChild(addResourcesImg);

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
        const resourceLinkContainer = document.createElement("div");

        // Find the matching logo
        const matchingLogo = logosForLinks.find(({ pattern }) => pattern.test(value));
        const imageSrc = matchingLogo ? matchingLogo.imageSrc : defaultLogo;

        const logoImage = document.createElement("img");
        logoImage.src = imageSrc;
        logoImage.style.width = "2.2em";
        logoImage.style.height = "2.2em";

        const linkElement = document.createElement("a");
        linkElement.href = value;
        linkElement.target = "_blank"; // Open in a new tab
        linkElement.appendChild(logoImage);

        resourceLinkContainer.appendChild(linkElement);
        resourcesFlex.appendChild(resourceLinkContainer);
    }
});

resourcesFlex.appendChild(addResources)

// function for showing categories
const renderCategory = async (category) => {

    const categoryDiv = document.createElement("div")
    categoryDiv.id = category.id
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
        videoElement.setAttribute("crossorigin","anonymous")
        videoElement.setAttribute("credentialless", true)
       
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
                try {
                    // Send the video URL to the backend
                    console.log("Category ID:", category.getId());
                    console.log("Video URL:", videoUrl);

                    const response = await mods.createVideo(category.getId(), `https://www.youtube.com/embed/${videoId}`);

                    if (response.ok) {
                        const result = await response.json();
                        console.log("Video successfully added to the database:", result);

                        // Update the UI only if the backend confirms success
                        const videoElement = document.createElement("iframe");
                        videoElement.classList.add("video-iframe");
                        videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                        videoElement.allowFullscreen = true;
                        videoBox.innerHTML = ""; // Clear previous content
                        videoBox.appendChild(videoElement);
                    } else {
                        const errorData = await response.json();
                        console.error("Error adding video to the database:", errorData);
                        alert(errorData.message || "Failed to update the video. Please try again.");
                    }
                } catch (error) {
                    if (error.message === "Access token is missing") {
                        alert("Unauthorized access. Please log in.");
                    } else {
                    console.error("Error adding video to the database:", error);
                    alert("An error occurred while updating the video. Please try again.");
                    }
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
    viewWRbtn.addEventListener("click", async () => {
        console.log("View WR-history button clicked")
        viewWRbtn.disabled = true
        viewWRbtn.style.opacity="0.5" // dimm the button
        viewWRbtn.style.pointerEvents="none" // no possibility to click again
        
        await openWRPopUp(categoryDiv, category.getId(), viewWRbtn)
    })

    // Category voting
    console.log("Stored token:", localStorage.getItem("accessToken"));
    console.log("Stored userId:", localStorage.getItem("userId"));

    const voteOptions = {
        difficulty: [1, 2, 3, 4, 5],
        optimization: [1, 2, 3, 4, 5],
        enjoyment: ['S', 'A', 'B', 'C', 'D', 'E', 'F']
    };

    const reverseTierMap = {
        1: "S",
        2: "A",
        3: "B",
        4: "C",
        5: "D",
        6: "E",
        7: "F"
    };
    const tierToNumber = {
        "S": 1,
        "A": 2,
        "B": 3,
        "C": 4,
        "D": 5,
        "E": 6,
        "F": 7
    };

    const sendVote = async (categoryName, value) => {
        const categoryId = category.getId()
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("No access token found.");
            return;
        }
        const userId = Number(localStorage.getItem("userId"));

        // Change letter to number if categoryName equals "enjoyment"
        const numericValue = categoryName === "enjoyment" ? tierToNumber[value] : value;

        const voteData = { [categoryName]: numericValue };
        try {
            const response = await fetch(`${backendUrl}/votes/${categoryId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                credentials: "include",
                body: JSON.stringify(voteData)
            });
            console.log("Vote saved:", voteData)
            if (!response.ok) throw new Error("Voting failed")
            const data = await response.json()
            console.log(data)
            
        } catch (error) {
            console.error("Error sending vote:", error)
        }
    }
    // fetch existing votes
    const fetchUserVotes = async (categoryId) => {
        const userId = Number(localStorage.getItem("userId"));
        try {
            const response = await fetch(`${backendUrl}/votes/${categoryId}?user_id=${userId}`, {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const votes = await response.json()
                console.log("Fetched votes:", votes)
                // get user's own votes
                const userVote = votes.find(v => v.user_id === userId)
                console.log("User vote:", userVote)

                if (!userVote) return {};
                return {
                    difficulty: userVote.difficulty ?? undefined,
                    optimization: userVote.optimization ?? undefined,
                    // from number to letter
                    enjoyment: userVote.enjoyment != null ? reverseTierMap[userVote.enjoyment] : undefined
                }
            } else {
                const errorBody = await response.json() 
                throw new Error(`Vote fetch failed" ${errorBody.message}`);
            }
        } catch (error) {
            console.error("Error fetching votes:", error);
            return {};
        }
    };

    const userVotes = await fetchUserVotes(category.getId());

    // Display average votes on categories
    const fetchAverages = async (categoryId) => {

        try {
            const response = await fetch(`${backendUrl}/votes/average/${categoryId}`);
            if(!response.ok) throw new Error("Failed to fetch averages")
                
            const averages = await response.json()
            return averages  
        
        } catch (error) {
            console.error("Error fetching averages:", error)
            return
        }
        
    }

    const votesContainer = document.createElement("div")
    votesContainer.classList.add("votes-container")

    const averages = await fetchAverages(category.getId());
    console.log("Fetched averages:", averages);

    
    // votebox for each voting category
    Object.entries(voteOptions).forEach(([categoryName, values]) => {
        const voteBox = document.createElement("div");
        voteBox.classList.add("voteBox")

        const voteCategoryName = document.createElement("h3");
        voteCategoryName.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        voteBox.appendChild(voteCategoryName);

        const starsContainer = document.createElement("div");
        starsContainer.classList.add("starsContainer");
        

        let selectedValue = null;
        const votedValue = userVotes[categoryName]

        // star for other categories except to enjoyment
        values.forEach((value, index) => {
            const star = document.createElement("span");
            star.classList.add("voteStar")
            star.textContent = categoryName === "enjoyment" ? value : "★";
            star.dataset.value = value;
            // show already given votes
            if (votedValue !== undefined) {
                let votedIndex = values.indexOf(votedValue)
                selectedValue = votedIndex
                if (categoryName === "enjoyment") {
                    votedIndex = values.indexOf(votedValue);
                    star.style.color = index === votedIndex ? "rgb(255, 145, 0)" : "#ccc";
                } else {
                    star.style.color = index <= votedIndex ? "rgb(255, 145, 0)" : "#ccc";
                }
            }

            // Hover-effect
            if (votedValue !== undefined) {
                star.addEventListener("mouseenter", () => {
                    if (categoryName === "enjoyment") {
                        star.style.color = "rgb(255, 165, 0)"
                    } else {
                        [...starsContainer.children].forEach((s, i) => {
                            s.style.color = i <= index ? "rgb(255, 165, 0)" : "#ccc";
                        });
                    }
                });

                // leaving hover
                star.addEventListener("mouseleave", () => {
                    [...starsContainer.children].forEach((s, i) => {
                        if (categoryName === "enjoyment") {
                            s.style.color = i === selectedValue ? "#f5b301" : "#ccc";
                        } else {
                            s.style.color = selectedValue !== null && i <= selectedValue ? "#f5b301" : "#ccc";
                        }
                    });
                });

                star.addEventListener("click", () => {
                    selectedValue = index;
                    
                    if (categoryName === "enjoyment") {
                        [...starsContainer.children].forEach((s, i) => {
                            s.style.color = i === index ? "rgb(255, 145, 0)" : "#ccc";
                        })
                    } else {
                        [...starsContainer.children].forEach((s, i) => {
                            s.style.color = i <= index ? "rgb(255, 145, 0)" : "#ccc";
                        })
                    }

                    sendVote(categoryName, values[index]);

                });
            }

            starsContainer.appendChild(star);
        });

        voteBox.appendChild(starsContainer);
        votesContainer.appendChild(voteBox);
        const averageKey = `avg_${categoryName}`
        const averageValue = averages[averageKey];
        const averageAsNumber = Number(averageValue)
        const countKey = `count_${categoryName}`
        const voteCount = averages[countKey]

        const averageDisplay = document.createElement("p");
        averageDisplay.classList.add("average")

        if (averageValue !== undefined && averageValue !== null) {
            if (categoryName === "enjoyment") {
                const roundedAverage = Math.round(averageAsNumber)
                averageDisplay.textContent = reverseTierMap[roundedAverage]
                    ? `Average: ${reverseTierMap[roundedAverage]} (votes: ${voteCount})`
                    : `Average: - (votes: ${voteCount})`;
            } else {
                averageDisplay.textContent = averageValue
                    ? `Average: ${averageValue} (votes: ${voteCount})`
                    : `Average: -   (votes: ${voteCount})`;
            }
        }
        voteBox.appendChild(averageDisplay);
        

        });


        categoryDiv.appendChild(votesContainer);
        return categoryDiv;
}

// getting categories from backend and appending to the html-page
const getCategories = async (modId) => {
    const div = document.createElement("div")
    div.id = "categories-container"
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");

    if (view === "tutorials" || view === "strategies") {
        div.style.display = "none";
    }
    const renderedCategories = []
    try {
        const result = await categories.getCategories(modId)
        console.log("Categories fetched:", result)
        div.innerHTML = ""; // clear previous categories so no duplicates will appear
        // If there are no categories
        if (!result || result.length === 0) {
            const noCategoriesMsg = document.createElement("p");
            noCategoriesMsg.textContent = "No categories available yet.";
            noCategoriesMsg.style.margin = "2rem"
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

const fetchWRHistory = async (categoryId, popUpContent) => {
    console.log("Fetching WR history for category", categoryId)
    try {
        const response = await fetch(`${backendUrl}/wr-history/${categoryId}`)
        const wrData = await response.json()
        console.log(wrData)
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
                resultItem.style.marginBottom = "1rem"

                const formattedDate = new Date(record.record_date).toLocaleDateString('fi-FI');
                resultItem.innerHTML =
                    `<strong>${record.record_time}</strong> by <strong>${record.runner_name}</strong><br>
                Record date: ${formattedDate}`
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
    const viewWR = document.getElementById("wr-button")

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
            // activate view WR-history button again after popUp is closed
            if (viewWR) {
                viewWR.disabled = false;
                viewWR.style.opacity = "1";
                viewWR.style.pointerEvents = "auto";
            }
        })

        popUpContent.appendChild(closeBtn)
        popUp.appendChild(popUpContent);
        categoryContent.appendChild(popUp)

    // button for adding new WR
    const addWrBtn = document.createElement("button")
    addWrBtn.textContent = "+"
    addWrBtn.id = "addWr"
    addWrBtn.addEventListener("click", () => {
        window.location.href = `AddWorldRecord.html?categoryId=${categoryId}`
    })
    popUpContent.appendChild(addWrBtn)
    } catch (error) {
        console.error("Error fetching categories:", error)
    
        if (viewWR) {
            viewWR.disabled = false;
            viewWR.style.opacity = "1";
            viewWR.style.pointerEvents = "auto";
        }
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

if (addCategoryLink) {
    addCategoryLink.addEventListener("click", (event) => {
        event.preventDefault()
        console.log('Form is visibile now')
        // form comes visible
        addCategoryForm.style.display = "block"
    })
}

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
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ category_name: newCategory })
        })
        if (response.ok) {
            const categoryData = await response.json()
            console.log("categoryData:", categoryData);

            categoryInput.value = "" // clear input field
            addCategoryForm.style.display = "none"

            if (categoryData.success && categoryData.category) {
                const addedCategory = {
                    category_id: categoryData.category.id,
                    category_name: categoryData.category.category_name
                }
                console.log("Tiedot lisättävästä kategoriasta", addedCategory)
                renderCategory(categoryData.category)
                setTimeout(() => {
                    scrollToCategory(addedCategory.category_id)
                }, 300)
            }
        } else if (response.status === 500) {
            alert("Category already exists")
        } else if (response.status === 401) {
            alert("Unauthorized access. Please log in.") }
        else {
            alert("Error while adding the category. Please try again later.")
            console.error("Error adding category:", response.statusText)
        }
    } catch (error) {
        console.error("Error adding category:", error)
    }
})
    // function to scroll to a newly added category  --> DOESN'T WORK YET
    function scrollToCategory(categoryId) {
        console.log("categoryId in scrollToCategory:", categoryId);
        const categoryDiv = document.getElementById(categoryId)
        if (categoryDiv) {
            categoryDiv.scrollIntoView({behavior: "smooth", block: "center"})
        } else {
            console.error("Category not found ", categoryId)
        }
    } 


// creating form and button for resource adding
const createInputField = (placeholder, linkInDatabase, required = false) => {
    const input = document.createElement("input");
    input.classList.add("category-input");
    input.type = "text";
    input.placeholder = placeholder;
    input.linkInDatabase = linkInDatabase;
    input.required = required;
    return input;
};

const createForm = (inputs, submitButtonText, onSubmit) => {
    const form = document.createElement("form");
    form.classList.add("resource-form");

    inputs.forEach((input) => form.appendChild(input));

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = submitButtonText;
    submitButton.classList.add("add-resource-btn");
    form.appendChild(submitButton);

    form.addEventListener("submit", onSubmit);

    return form;
};

// Create input fields for the resource form
const resourceInputs = [
    createInputField("RunThinkShootLive", "rtsl"),
    createInputField("ModDB", "moddb"),
    createInputField("Steam", "steam"),
    createInputField("Extra link", "extra1"),
    createInputField("Extra link", "extra2"),
    createInputField("Extra link", "extra3"),
    createInputField("Speedrun.com", "src"),
];

// Handle resource form submission
const handleResourceFormSubmit = async (event) => {
    event.preventDefault();

    const resourceData = resourceInputs.reduce((acc, input) => {
        acc[input.linkInDatabase] = input.value;
        return acc;
    }, {});

    if (Object.keys(resourceData).length === 0) {
        alert("At least one resource link is required.");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/mods/${modId}/resourcelinks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resourceData),
            credentials: "include",
        });

        if (response.status === 401) {
            alert("Unauthorized access. Please log in.");
            return;
        }

        if (response.ok) {
            console.log("Resource links saved successfully:", await response.json());
            addResourceForm.style.border = "2px solid green";
            setTimeout(() => {
                addResourceForm.classList.remove("show");
                setTimeout(() => {
                    addResourceForm.style.border = "2px solid #333";
                    addResourceForm.style.visibility = "hidden";
                }, 300);
            }, 500);
        } else {
            console.error("Error saving resource links:", response.statusText);
            alert("Failed to save resource links. Please try again.");
        }
    } catch (error) {
        console.error("Error saving resource links:", error);
        alert("An error occurred while saving resource links.");
    }
};

// Create the resource form
const addResourceForm = createForm(resourceInputs, "Add", handleResourceFormSubmit);
document.body.appendChild(addResourceForm);

// Function to populate input fields with existing resource links
const populateResourceForm = async () => {
    try {
        const existingLinks = await fetchResourceLinks(modId); // Fetch existing links
        console.log("Existing resource links:", existingLinks);

        // Map the fetched links to the input fields
        resourceInputs.forEach((input) => {
            const linkInDatabase = input.linkInDatabase; // Match by linkInDatabase
            if (existingLinks[linkInDatabase]) {
                input.value = existingLinks[linkInDatabase]; // Set the value if it exists
            } else {
                input.value = ""; // Leave empty if no link exists
            }
        });
    } catch (error) {
        console.error("Error populating resource form:", error);
    }
};

// Show the resource form when the "Add Resources" button is clicked
if (addResources) {
    addResources.addEventListener("click", async (event) => {
        event.preventDefault();
        console.log("Form is visible now");

        await populateResourceForm(); // Populate the form with existing links
        addResourceForm.classList.add("show");
        addResourceForm.style.visibility = "visible";
    });
}

    // hide resource and category form when clicked outside
    document.addEventListener("click", (event) => {

        if (
            addResourceForm.classList.contains("show") &&
            !addResourceForm.contains(event.target) &&
            !addResources.contains(event.target)
        ) {
            addResourceForm.classList.remove("show");
            addResourceForm.style.visibility = "hidden";
        }

        if (
            addCategoryForm.style.display === "block" &&
            !addCategoryForm.contains(event.target) &&
            !addCategoryLink.contains(event.target)
        ) {
            addCategoryForm.style.display = "none";
        }
    });

// Switch between content

const showCategories = () => {
    const categoriesDiv = document.getElementById("categories-container");
    if (categoriesDiv) {
        categoriesDiv.style.display = "block";
    }
};

const categoriesMenu = document.getElementById("categoriesMenu")
const tutorialsMenu = document.getElementById("tutorialsMenu")
const strategiesMenu = document.getElementById("strategiesMenu")

categoriesMenu.addEventListener("click", () => {
    const parameters = new URLSearchParams(window.location.search);
    parameters.delete("view");
    const newUrl = `${window.location.pathname}?${parameters.toString()}`;
    history.pushState(null, "", newUrl);
    hideExistingContent()
    showCategories()
});

tutorialsMenu.addEventListener("click", () => {
    const parameters = new URLSearchParams(window.location.search);
    parameters.set("view", "tutorials");
    const newUrl = `${window.location.pathname}?${parameters.toString()}`;
    history.pushState(null, "", newUrl);
    hideExistingContent()
    loadGuides();
});

strategiesMenu.addEventListener("click", () => {
    const parameters = new URLSearchParams(window.location.search);
    parameters.set("view", "strategies");
    const newUrl = `${window.location.pathname}?${parameters.toString()}`;
    history.pushState(null, "", newUrl);
    hideExistingContent()
    loadGuides();
});


//getCategories();

