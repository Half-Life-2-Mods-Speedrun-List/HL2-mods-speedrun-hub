const pool = require('../helpers/db.js');

const getGuideVideo = async (mod_id, type) => {
    try {
        const result = await pool.query(
            'SELECT guide_id, video FROM guides WHERE mod_id = $1 AND type = $2',  
            [mod_id, type]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching video:", error);
        throw new Error("Failed to fetch video");
    }
};

const getGuideImage = async (mod_id, type) => {
    try {
        const result = await pool.query(
            'SELECT guide_id, image FROM guides WHERE mod_id = $1 AND type = $2',  
            [mod_id, type]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching image:", error);
        throw new Error("Failed to fetch image");
    }
};

const getGuideDescription = async (mod_id, type) => {
    try {
        const result = await pool.query(
            'SELECT guide_id, description FROM guides WHERE mod_id = $1 AND type = $2',  
            [mod_id, type]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching description:", error);
        throw new Error("Failed to fetch description");
    }
};

module.exports = { getGuideVideo, getGuideImage, getGuideDescription };