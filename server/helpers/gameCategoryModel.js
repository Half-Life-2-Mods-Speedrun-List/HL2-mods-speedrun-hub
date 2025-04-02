const pool = require("./db.js");

/* category creation to categories table

const createCategory = async (name) => {
    const result = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name]
    );
    return result.rows[0];
}; */

// combining categories and mods

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
        await client.query("COMMIT")
        return {id: categoryId, name};
    } catch (error) {
        await client.query("ROLLBACK")
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { createCategory };