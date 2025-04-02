const pool = require("./db.js");

const createCategory = async (name, mod_id) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // adding category to categories-table
        const categoryResult = await client.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING *",
            [name]
        );
        const categoryId = categoryResult.rows[0].category_id;

        // adding to mod_category table
        await client.query(
            "INSERT INTO mod_category (mod_id, category_id) VALUES ($1, $2)",
            [mod_id, categoryId]
        )
        await client.query("COMMIT") // commit saves data to database
        return {id: categoryId, name};
    } catch (error) {
    // if there's error with the query, rollback cancels all previous actions
        await client.query("ROLLBACK")
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { createCategory };