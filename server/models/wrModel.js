const pool = require('../helpers/db.js');

const getWRHistory = async (categoryId) => {
    try {
        const result = await pool.query(
            'SELECT wr.runner_name, wr.record_time, wr.record_date, u.username FROM world_records wr JOIN users u ON wr.user_id = u.user_id WHERE wr.category_id = $1 ORDER BY wr.record_time ASC',  
            [categoryId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching WR history:", error);
        throw new Error("Failed to fetch WR history");
    }
};

module.exports = { getWRHistory };