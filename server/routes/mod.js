const { query } = require("../helpers/db.js")
const express = require("express")
const { getResourceLinks } = require("../models/resourceLinksModel.js");
const { getGuideVideo, getGuideImage, getGuideDescription } = require('../models/guideModel');
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
            'SELECT m.mod_id, m.mod_name, c.category_name, c.wr_video FROM mods AS m INNER JOIN mod_category mc ON m.mod_id = mc.mod_id INNER JOIN categories c ON mc.category_id = c.category_id;')
        rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


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

modRouter.post("/newmod", verifyToken, fetchUserId, async (req, res) => {
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
            // Send the mod_id in the response
            const modId = newMod.rows[0].mod_id;
            res.status(200).json({message: "New mod created: " + mod_name, mod_id: modId});
        } catch (error) {
            console.error("Error creating a new mod", error);
            res.status(500).json({message: "Server error"})
        }
});

modRouter.get("/:modId/resourcelinks", async (req, res) => {
    const { modId } = req.params;

    try {
        const resourceLinks = await getResourceLinks(modId);

        if (resourceLinks.length === 0) {
            return res.status(404).json({ message: "No resource links set for this mod" });
        }

        res.status(200).json(resourceLinks[0]);
    } catch (error) {
        console.error("Error fetching resource links:", error);
        res.status(500).json({ message: "Failed to fetch resource links" });
    }
});

modRouter.post("/:modId/resourcelinks", verifyToken, async (req, res) => {
    const { modId } = req.params;
    const { rtsl, moddb, steam, extra1, extra2, extra3, src } = req.body;

    if(!req.user) {
        return res.status(401).json({ error: "Unauthorized user. Please log in/register to add category."});
    }

    try {
        // Check if a record already exists for the given modId
        const existingRecord = await query(
            "SELECT * FROM resource_links WHERE mod_id = $1",
            [modId]
        );

        if (existingRecord.rows.length > 0) {
            // Update the existing record
            await query(
                `UPDATE resource_links
                 SET rtsl = $1, moddb = $2, steam = $3, extra1 = $4, extra2 = $5, extra3 = $6, src = $7
                 WHERE mod_id = $8`,
                [rtsl, moddb, steam, extra1, extra2, extra3, src, modId]
            );
            return res.status(200).json({ message: "Resource links updated successfully" });
        } else {
            // Insert a new record
            await query(
                `INSERT INTO resource_links (mod_id, rtsl, moddb, steam, extra1, extra2, extra3, src)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [modId, rtsl, moddb, steam, extra1, extra2, extra3, src]
            );
            return res.status(201).json({ message: "Resource links added successfully" });
        }
    } catch (error) {
        console.error("Error saving resource links:", error);
        res.status(500).json({ message: "Failed to save resource links" });
    }
});

modRouter.get("/:modId/display-guide", async (req, res) => {
    const { modId } = req.params;
    const { view } = req.query;

    let type;
    if (view === "tutorials") {
        type = 2;
    } else if (view === "strategies") {
        type = 1;
    } else {
        return res.status(400).json({ message: "Invalid view parameter" });
    }

    try {
        // Fetch all guides for the given modId and type
        const guides = await query(
            `SELECT guide_id, video, image, description 
             FROM guides 
             WHERE mod_id = $1 AND type = $2`,
            [modId, type]
        );

        if (guides.rows.length === 0) {
            return res.status(404).json({ message: "No guides found for this mod and type" });
        }

        // Return all guides as an array
        return res.status(200).json(guides.rows);
    } catch (error) {
        console.error("Error fetching guides:", error);
        res.status(500).json({ message: "Failed to fetch guides" });
    }
});

modRouter.post("/:modId/update-guide", verifyToken, async (req, res) => {
    const { modId } = req.params;
    const { type, video, image, description, guide_id } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized user. Please log in/register to add content." });
    }


    if (type !== 1 && type !== 2) {
        return res.status(400).json({ message: "Invalid type. Must be 1 (strategies) or 2 (tutorials)." });
    }

    // Ensure only one field is provided in the request
    const providedFields = [video, image, description].filter((field) => field !== undefined);
    if (providedFields.length !== 1) {
        return res.status(400).json({ message: "Only one field (video, image, or description) can be set at a time." });
    }

    try {
        if (guide_id) {
            const existingGuide = await query(
                "SELECT * FROM guides WHERE mod_id = $1 AND type = $2 AND guide_id = $3",
                [modId, type, guide_id]
            );

            if (existingGuide.rows.length > 0) {
                const existingVideo = existingGuide.rows[0].video;
                const existingImage = existingGuide.rows[0].image;

                if (video && existingImage) {
                    return res.status(400).json({ message: "Cannot add a video when an image already exists for a guide." });
                }
                if (image && existingVideo) {
                    return res.status(400).json({ message: "Cannot add an image when a video already exists for a guide." });
                }

                let updateField, updateValue;

                if (video) {
                    updateField = "video";
                    updateValue = video;
                } else if (image) {
                    updateField = "image";
                    updateValue = image;
                } else if (description) {
                    updateField = "description";
                    updateValue = description;
                }

                const updateQuery = `
                    UPDATE guides
                    SET ${updateField} = $1
                    WHERE mod_id = $2 AND type = $3 AND guide_id = $4
                `;

                await query(updateQuery, [updateValue, modId, type, guide_id]);
                return res.status(200).json({ message: `${updateField} updated successfully.` });
            } else {
                return res.status(404).json({ message: "Guide not found for the provided guide_id." });
            }
        } else {
            // Insert a new guide (when no guide_id is provided)
            const insertFields = ["mod_id", "type"];
            const insertValues = [modId, type];
            const placeholders = ["$1", "$2"];
            let fieldIndex = 3;

            if (video) {
                insertFields.push("video");
                insertValues.push(video);
                placeholders.push(`$${fieldIndex++}`);
            } else if (image) {
                insertFields.push("image");
                insertValues.push(image);
                placeholders.push(`$${fieldIndex++}`);
            } else if (description) {
                insertFields.push("description");
                insertValues.push(description);
                placeholders.push(`$${fieldIndex++}`);
            }

            const insertQuery = `
                INSERT INTO guides (${insertFields.join(", ")})
                VALUES (${placeholders.join(", ")})
                RETURNING guide_id
            `;

            const result = await query(insertQuery, insertValues);
            return res.status(201).json({ message: "Guide content added successfully.", guide_id: result.rows[0].guide_id });
        }
    } catch (error) {
        console.error("Error saving guide content:", error);
        res.status(500).json({ message: "Failed to save guide content." });
    }
});



module.exports = {
    modRouter
}