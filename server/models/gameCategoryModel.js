const pool = require("../helpers/db.js");

const createCategory = async (name, mod_id, user_id) => {
    console.log("Creating category with name:", name, "and mod_id", mod_id)
    
    try {
        console.log("Starting transaction")
        await pool.query("BEGIN");

        // check if category already exists
        const existingCategory = await pool.query('SELECT * FROM categories WHERE category_name=$1', [name]);
        console.log("Existing categories:", existingCategory.rows)

        if (existingCategory.rows.length > 0) {
            throw new Error ("Category already exists")
        }

        // adding category to categories-table
        console.log("Inserting new category")
        const categoryResult = await pool.query(
            "INSERT INTO categories (category_name, user_id) VALUES ($1, $2) RETURNING *",
            [name, user_id]
        );
        const categoryId = categoryResult.rows[0].category_id;
        console.log("Inserting into mod_category table with modId:", mod_id, "and with categoryId", categoryId)

        // Check if the category is already linked to this mod
        const existingModCategory = await pool.query(
            "SELECT * FROM mod_category WHERE mod_id = $1 AND category_id = $2",
            [mod_id, categoryId]
        );

        if (existingModCategory.rows.length > 0) {
            throw new Error("Category already linked to this mod");
        }
        // adding to mod_category table
        await pool.query(
            "INSERT INTO mod_category (mod_id, category_id) VALUES ($1, $2) RETURNING *",
            [mod_id, categoryId]
        )
        await pool.query("COMMIT") // commit saves data to database
        return {id: categoryId, name};
    } catch (error) {
    // if there's error with the query, rollback cancels all previous actions
        await pool.query("ROLLBACK")
        console.error("Error creating category:", error);
        throw new Error(`Failed to create category: ${error.message}`)
    } 
};

module.exports = { createCategory };