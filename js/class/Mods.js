
import { Mod } from "./Mod.js"
import { setEndpoint } from "../Utils.js"

class Mods {
    #mods = []
    #backend_url = ""
    #modsWithCategories = []

    constructor(url, endpoint = "/mods") {
        this.#backend_url = setEndpoint(endpoint, url)
    }

    getMods = () => {
        console.log("Fetching from URL:", this.#backend_url);

        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            
            .then((response) => response.json())
            .then((json) => {
                this.#readJson(json)
                resolve(this.#mods)
            }, (error) => {
                reject(error)
            })
            console.log(this.#mods)
        })
        
    }

    #readJson = (modsAsJson) => {
        modsAsJson.forEach(element => {
            const mod = new Mod(element.mod_id, element.mod_name)
            this.#mods.push(mod)
        });
    }

    getModsWithCategories = async () => {
        this.#backend_url = setEndpoint("/mods/categories", this.#backend_url)
        try {
            const response = await fetch(this.#backend_url)
            const json = await response.json()
        }
    }
}

export { Mods }