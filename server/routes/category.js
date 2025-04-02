const express = require("express");
const { createCategory } = require("../helpers/gameCategoryModel.js");
const router = express.Router();

const addCategory = async (req, res) => {
    try {
        const {name} = req.body;
        // mod's id should come directly from url
        const {mod_id} = req.params

        console.log(req.body);

        if (!name) {
            return res.status(400).json({ error:"Category name is required"});
        }

        const newCategory = await createCategory(name, mod_id);
        res.status(200).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"});
    }
}

// saving the mod's id to the URL-path :mod_id
router.post("/mods/:mod_id/categories", addCategory);

module.exports = router;