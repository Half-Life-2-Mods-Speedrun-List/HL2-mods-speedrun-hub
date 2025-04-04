class Mod {
    #id
    #text

    constructor (id, text) {
        this.#id = id
        this.#text = text
    }

    getId() {
        return this.#id
    }

    getText() {
        return this.#text
    }

    get mod_id() {
        return this.#id;
    }

    get mod_name() {
        return this.#text;
    }
}

export { Mod }