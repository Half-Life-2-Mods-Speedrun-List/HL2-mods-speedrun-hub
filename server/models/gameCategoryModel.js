const pool = require("../helpers/db.js");

const createCategory = async (name, mod_id) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // check if category already exists
        const existingCategory = await client.query('SELECT * FROM categories WHERE name=$1', [name]);

        if (existingCategory.rows.length > 0) {
            throw new Error ("Category already exists")
        }

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
        console.error("Error creating category:", error.message);
        throw new Error("Failed to create category")
    } finally {
        client.release();
    }
};

module.exports = { createCategory };