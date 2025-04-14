const pool = require('../helpers/db.js');

const getResourceLinks = async (modId) => {
    try {
        const result = await pool.query(
            'SELECT rtsl, moddb, steam, extra1, extra2, extra3, src FROM resource_links WHERE mod_id = $1',  
            [modId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching resource links:", error);
        throw new Error("Failed to fetch resource links");
    }
};

module.exports = { getResourceLinks };