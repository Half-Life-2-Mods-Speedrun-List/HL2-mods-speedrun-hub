
import { Mod } from "./Mod.js"

class Mods {
    #mods = []
    #backend_url = ""

    constructor(url, endpoint = "/mods") {
        this.#backend_url = new URL(endpoint, url).href
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
}

export { Mods }