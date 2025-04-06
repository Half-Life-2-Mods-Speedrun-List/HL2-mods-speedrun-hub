const { query } = require("../helpers/db.js")
const express = require("express")
const { verifyToken } = require("../helpers/verifyToken.js");
const modRouter = express.Router()

modRouter.get("/", async (req, res) => {
    try {
        const result = await query('SELECT mod_id, mod_name FROM mods')
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

/* TEMPORARILY COMMENTED OUT USER AUTHENTICATION FOR TESTING
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
};*/

// modRouter.post("/newmod", verifyToken, fetchUserId, async (req, res) => {
modRouter.post("/newmod", async (req, res) => {
    console.log("trying to add a new mod...")
    console.log("Request body:", req.body)

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

module.exports = {
    modRouter
}