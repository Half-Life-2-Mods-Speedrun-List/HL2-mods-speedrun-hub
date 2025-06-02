import { Category } from "./Category.js";

class Categories {
    #categories = []
    #backend_url = ""

    constructor(url, endpoint = "/categories") {
        this.#backend_url = url + endpoint;
    }
    getCategories = async (modId) => {
        const url = `${this.#backend_url}/${modId}`;
        try {
            console.log("Fetching categories for modId:", modId);
            console.log("Fetching from URL:", url);
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json()
            console.log("Raw json response:", json)
            this.#readJson(json, this.#categories, (data) => new Category(data.category_id, data.category_name));

            return this.#categories
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }
    #readJson = (jsonArray, targetArray, mappingFunction) => {
        targetArray.length = 0; 
        jsonArray.forEach((element) => {
            targetArray.push(mappingFunction(element));
        });
    }

}
export { Categories }