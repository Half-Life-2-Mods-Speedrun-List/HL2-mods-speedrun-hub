const express = require("express");
const { query } = require("../helpers/db.js");
const { verifyToken } = require("../helpers/verifyToken.js");

const newModRouter = express.Router()




const fetchUserId = async (req, res, next) => {
    try {
        console.log("Fetching user_id for username:", req.user.username);
        const user = req.user.username;
        const userFromDb = await query(
            'SELECT * FROM users WHERE username = $1', [user]
        );

        if (userFromDb.rowCount === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.user_id = userFromDb.rows[0].user_id;
        console.log("Fetched user_id:", req.user_id);
        next();
    } catch (error) {
        console.error("Error fetching user_id:", error);
        return res.status(500).json({ error: "Failed to fetch user_id" });
    }
};


newModRouter.post("/newmod", verifyToken, fetchUserId, async (req, res) => {
    const { mod_name } = req.body;
    const user_id = req.user_id;

        try {
        const result = await query('SELECT * FROM mods WHERE mod_name=$1', [mod_name]);

        // if the name is a duplicate, return an error
        if (result.rows.length > 0) {
            return res.status(400).json({message: "Mod with the same name already exists"});
        }
        // new modification to db
        const newMod = await query(
            'INSERT INTO mods (mod_name, user_id) VALUES ($1, $2) RETURNING *',
            [mod_name, user_id]
            );
            console.log("New mod created:", newMod.rows[0]);
            res.status(200).json({message: "New mod created: " + mod_name});
        } catch (error) {
            console.error("Error creating a new mod", error);
            res.status(500).json({message: "Server error"})
        }
});

module.exports = { newModRouter };