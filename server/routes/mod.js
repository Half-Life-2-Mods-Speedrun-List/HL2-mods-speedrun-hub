const { query } = require("../helpers/db.js")
const express = require("express")

const modRouter = express.Router()

modRouter.get("/", async (req, res) => {
    try {
        const result = await query('select mod_name from mods')
        rows = result.rows ? result.rows : [] //this is done to make sure it is not null
        res.status(200).json(rows)
    } catch(error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

module.exports = {
    modRouter
}