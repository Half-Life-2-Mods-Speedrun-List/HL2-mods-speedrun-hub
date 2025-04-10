const express = require("express");
const { createCategory } = require("../models/gameCategoryModel.js");
const { query } = require("../helpers/db.js");
const categoryRouter = express.Router();
const { getWRVideo } = require("../models/wrVideoModel.js");
const { verifyToken } = require("../helpers/verifyToken.js")

const addCategory = async (req, res) => {
    try {
        console.log(req.body);
        const {category_name} = req.body;
        // mod's id should come directly from url
        const {mod_id} = req.params

        // TEMPORARILY COMMENTED OUT USER AUTHENTICATION FOR TESTING
        // user authetication check
        /*if(!req.user) {
            return res.status(401).json({ error: "Unauthorized user. Please log in/register to add category."});
        }*/

        const modExists = await query('SELECT * FROM mods WHERE mod_id = $1', [mod_id])
        if (modExists.rowCount === 0 ) {
            return res.status(404).json({error: `Mod with ID ${mod_id} not found`})
        }
        
        if (!category_name) {
            return res.status(400).json({ error:"Category name is required"});
        }
        const newCategory = await createCategory(category_name, mod_id);
        res.status(200).json({success: true, category: newCategory});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error"});
    }
}

categoryRouter.get("/:categoryId/wr-video", async (req, res) => {
    const { categoryId } = req.params;

    try {
        const wrVideo = await getWRVideo(categoryId);

        if (wrVideo.length === 0) {
            return res.status(404).json({ message: "No WR video found for this category" });
        }

        res.status(200).json(wrVideo[0]);
    } catch (error) {
        console.error("Error fetching WR video:", error);
        res.status(500).json({ message: "Failed to fetch WR video" });
    }
});

categoryRouter.post("/:categoryId/wr-video", async (req, res) => {
    const { categoryId } = req.params;
    const { wr_video } = req.body;

    console.log("Received categoryId:", categoryId);
    console.log("Received wr_video:", wr_video);
    console.log("Updating category with ID:", categoryId, "WR video:", wr_video);

    if (!wr_video) {
        return res.status(400).json({ message: "WR video URL is required" });
    }

    try {
        const result = await query(
            `UPDATE categories 
             SET wr_video = $1
             WHERE category_id = $2 
             RETURNING *`,
            [wr_video, categoryId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "WR video added successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error adding WR video:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// saving the mod's id to the URL-path :mod_id
// TEMPORARILY COMMENTED OUT USER AUTHENTICATION FOR TESTING
//categoryRouter.post("/:mod_id", verifyToken, addCategory);
categoryRouter.post("/:mod_id", async (req, res) => {
    // Log to check if the request is reaching the server
    console.log("Received POST request for mod ID:", req.params.mod_id);
    console.log("Request body:", req.body);

    addCategory(req, res);  // Call the original function
})

categoryRouter.get("/:mod_id", async (req, res) => {
    const {mod_id}  = req.params
    try {
        const result = await query(
            `SELECT c.category_id, c.category_name
            FROM categories c 
            INNER JOIN mod_category mc ON mc.category_id = c.category_id
            WHERE mc.mod_id = $1;`, 
            [mod_id]
        )
       
        const rows = result.rows ? result.rows : []
        console.log(result.rows)
        
        if (rows.length === 0) {
            return res.status(404).json({ error: `No categories found for mod with ID ${mod_id}` });
        }
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({error: "server error", details: error})
    }
})

module.exports = { categoryRouter };