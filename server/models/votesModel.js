const pool = require('../helpers/db.js');

const getVotes = async (userId, categoryId) => {
   try {
    const result = await pool.query(
        `SELECT * FROM votes WHERE user_id = $1 AND category_id = $2`,
         [userId, categoryId]
    )
    return result.rows;
    } catch (error) {
        console.error("Error getting votes by user and category", error);
        throw error;
    }
    
}

const createOrUpdateVote = async ({difficulty, optimization, enjoyment, user_id, category_id}) => {
    const existingVote = await pool.query(
        `SELECT * FROM votes WHERE user_id=$1 AND category_id=$2`,
        [user_id, category_id]
    )
    if (existingVote.rows.length > 0) {
        const existingVoteData = existingVote.rows[0];
        const updates = []
        const values = []
        let i = 1 // this keeps track of SQL parameters order flexible way ($1, $2 ..etc)

        if (difficulty !== undefined) {
            updates.push(`difficulty = $${i++}`)
            values.push(difficulty)
        }
        if (optimization !== undefined) {
            updates.push(`optimization = $${i++}`);
            values.push(optimization);
        }
        if (enjoyment !== undefined) {
            updates.push(`enjoyment = $${i++}`);
            values.push(enjoyment);
        }
        if (updates.length > 0) {
        values.push(user_id, category_id) // user_id = $i, category_id = $i+1

        const query = `
            UPDATE votes
            SET ${updates.join(", ")}
            WHERE user_id=$${i++} AND category_id = $${i}
            RETURNING *`
        const result = await pool.query(query, values)
        return result.rows[0]
        } else {
            return existingVoteData
        }
        } else {
        // new row to database even if only some values are given, others stay null
        const result = await pool.query(
            `INSERT INTO votes (difficulty, optimization, enjoyment, user_id, category_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [difficulty || null, optimization || null, enjoyment || null, user_id, category_id]
        )
        return result.rows[0]
    }
}

const categoryVotesAvg = async (categoryId) => {
    try {
        const result = await pool.query(`
            SELECT 
                ROUND(AVG(difficulty), 2) AS avg_difficulty,
                COUNT(difficulty) AS count_difficulty,
                ROUND(AVG(optimization), 2) AS avg_optimization,
                COUNT(optimization) AS count_optimization,
                ROUND(AVG(enjoyment), 2) AS avg_enjoyment,
                COUNT(enjoyment) AS count_enjoyment
            FROM votes
            WHERE category_id = $1`, [categoryId]);

        return result.rows[0]; 
    } catch (error) {
        console.error("Error getting category vote averages", error);
        throw error;
    }
}

module.exports = { getVotes, createOrUpdateVote, categoryVotesAvg };