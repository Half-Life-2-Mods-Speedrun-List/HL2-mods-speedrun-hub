
import { Mod } from "./Mod.js"

class Mods {
    #mods = []
    #backend_url = ""
    #modsWithCategories = []

    constructor(url, endpoint = "/mods") {
        this.#backend_url = new URL (endpoint, url).href
    }

    getMods = async () => {
        console.log("Fetching from URL:", this.#backend_url);
        try {
            const response = await fetch(this.#backend_url);
            const json = await response.json();
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
        const endpoint = new URL("/mods/categories", this.#backend_url).href;
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
/*
    // get WR video from a mod
    getVideo = async (categoryId) => {
        const endpoint = new URL(`/categories/${categoryId}/wr-video`, this.#backend_url).href;
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Failed to fetch WR video");
            }
            const result = await response.json();
            return result.wr_video;
        } catch (error) {
            console.error("Error fetching WR video:", error);
            throw error;
        }
    };
    */

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
            });

            if (!response.ok) {
                throw new Error("Failed to add video");
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error adding video:", error);
            throw error;
        }
    }; 
}


export { Mods }