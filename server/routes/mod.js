const { query } = require("../helpers/db.js")
const express = require("express")

const modRouter = express.Router()

modRouter.get("/", async (req, res) => {
    try {
        const result = await query('select mod_id, mod_name from mods')
        rows = result.rows ? result.rows : [] //this is done to make sure it is not null, as that would crash the backend
        res.status(200).json(rows)
    } catch(error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

modRouter.get("/categories", async (req, res) => {
    try {
        const result = await query (
            'SELECT mods.mod_id, mods.mod_name, categories.category_name  FROM mods INNER JOIN categories ON mods.category_id = categories.category_id;')
        rows = result.rows ? result.rows : []
        console.log(rows)
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

module.exports = {
    modRouter
}