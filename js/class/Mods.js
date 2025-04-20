
import { Mod } from "./Mod.js"

class Mods {
    #mods = []
    #backend_url = ""
    #modsWithCategories = []
    #guides = []

    constructor(url, endpoint = "/mods") {
        this.#backend_url = new URL (endpoint, url).href
    }

    getMods = async () => {
        console.log("Fetching from URL:", this.#backend_url);
        try {
            const response = await fetch(this.#backend_url);
            const json = await response.json();
            console.log("Received JSON from backend (should be array):", json);

            if (!Array.isArray(json)) {
                console.error("json is not an array!", json);
                return;
            }
            this.#readJson(json, this.#mods, (data) => new Mod(data.mod_id, data.mod_name));
            return this.#mods;
            
        } catch (error) {
            console.error(error)
        }
    }

    #readJson = (jsonArray, targetArray, mappingFunction) => {
        targetArray.length = 0; 
        jsonArray.forEach((element) => {
            targetArray.push(mappingFunction(element));
        });
    }


    getModsWithCategories = async () => {
        const endpoint = new URL("/categories", this.#backend_url).href;
        try {
            const response = await fetch(endpoint)
            const json = await response.json()
            this.#readJson(json, this.#modsWithCategories, (data) => ({
                id: data.mod_id,
                name: data.mod_name,
                category: data.category_name,
                wr_video: data.wr_video,
            }));
            return this.#modsWithCategories;
        } catch (error) {
            console.error(error)
        }
    }


    // add category to mod
    createCategory = async (modId, categoryName) => {
        const endpoint = new URL(`/categories/${modId}`, this.#backend_url).href;
        const data = { category_name: categoryName };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Failed to create category");
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error creating category:", error)
        throw error;
    }
    }

    // Add WR video to a mod
    createVideo = async (categoryId, videoUrl) => {
        const endpoint = new URL(`/categories/${categoryId}/wr-video`, this.#backend_url).href;
        const data = { wr_video: videoUrl };

        console.log("Sending data to backend:", { endpoint, data });

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add video");
            }
            return response;
        } catch (error) {
            console.error("Error adding video:", error);
            throw error;
        }
    }; 

// Fetch guides for a specific mod
getGuides = async (modId, view) => {
    const endpoint = new URL(`/mods/${modId}/display-guide?view=${view}`, this.#backend_url).href;
    try {
        console.log("Fetching guides for modId:", modId, "with view:", view);
        console.log("Fetching from URL:", endpoint);
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        console.log("Raw JSON response for guides:", json);

        // Clear the guides array
        this.#guides.length = 0;

        // Process the array of guides
        if (Array.isArray(json)) {
            json.forEach((guide) => {
                this.#guides.push({
                    guide_id: guide.guide_id,
                    type: guide.type,
                    video: guide.video || null,
                    image: guide.image || null,
                    description: guide.description || null,
                });
            });
        } else {
            console.error("Expected an array of guides but received:", json);
        }

        return this.#guides;
    } catch (error) {
        console.error("Error fetching guides:", error);
    }
};

    createGuideVideo = async (modId, videoUrl, guideId, type) => {
        const endpoint = new URL(`/mods/${modId}/update-guide`, this.#backend_url).href;
        const data = { video: videoUrl, guide_id: guideId, type: type };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Failed to create guide video");
            }
            return response;
        } catch (error) {
            console.error("Error creating guide video:", error);
            throw error;
        }
    };
}


export { Mods }