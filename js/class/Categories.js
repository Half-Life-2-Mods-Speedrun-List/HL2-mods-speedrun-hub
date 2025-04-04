import { Category } from "./Category.js";

class Categories {
    #categories = []
    #backend_url = ""

    constructor(url, endpoint = "/categories") {
        this.#backend_url = new URL (endpoint, url).href
    }
    getCategories = async (modId) => {
        const url = this.#backend_url + "/" + modId;
        try {
            const response = await fetch(url)
            const json = await response.json()
            console.log(json)
            this.#readJson(json, this.#categories, (data) => new Category(data.category_id, data.category_name));

            return this.#categories
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

}
export { Categories }