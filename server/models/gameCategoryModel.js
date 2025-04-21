const pool = require("../helpers/db.js");

const createCategory = async (category_name, mod_id, user_id) => {
    console.log("Creating category with name:", category_name, "and mod_id", mod_id)
    
    try {
        console.log("Starting transaction")
        await pool.query("BEGIN");

        // check if category already exists
        const existingCategory = await pool.query(
            `SELECT c.category_id FROM categories c 
            JOIN mod_category mc ON c.category_id=mc.category_id
            WHERE c.category_name = $1 AND mc.mod_id=$2`, [category_name, mod_id]);
        console.log("Existing categories:", existingCategory.rows)

        if (existingCategory.rows.length > 0) {
            console.log("Category already exists in this mod");
            await pool.query("ROLLBACK");
            throw new Error("Category already exists in this mod");
        } 
        // adding category to categories-table 
            const categoryResult = await pool.query(
                "INSERT INTO categories (category_name, user_id) VALUES ($1, $2) RETURNING *",
                [category_name, user_id])
        
            const categoryId = categoryResult.rows[0].category_id;
            console.log("Inserted new category with ID:", categoryId);
        
        // adding to mod_category table
        await pool.query(
            "INSERT INTO mod_category (mod_id, category_id) VALUES ($1, $2) RETURNING *",
            [mod_id, categoryId]
        )
        await pool.query("COMMIT") // commit saves data to database
        return {id: categoryId, category_name};
    } catch (error) {
    // if there's error with the query, rollback cancels all previous actions
        await pool.query("ROLLBACK")
        console.error("Error creating category:", error);
        throw new Error(`Failed to create category: ${error.message}`)
    } 
};

module.exports = { createCategory };