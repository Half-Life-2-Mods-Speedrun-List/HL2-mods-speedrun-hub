const pool = require('../helpers/db.js');

const getWRVideo = async (categoryId) => {
    try {
        const result = await pool.query(
            'SELECT wr_video FROM categories WHERE category_id = $1',  
            [categoryId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching WR video:", error);
        throw new Error("Failed to fetch WR video");
    }
};

module.exports = { getWRVideo };