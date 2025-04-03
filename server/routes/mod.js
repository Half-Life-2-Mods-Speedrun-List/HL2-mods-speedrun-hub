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
            'SELECT m.mod_id, m.mod_name, c.category_name FROM mods AS m INNER JOIN mod_category mc ON m.mod_id = mc.mod_id INNER JOIN categories c ON mc.category_id = c.category_id;')
        rows = result.rows ? result.rows : []
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