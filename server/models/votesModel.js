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
        let i = 1

        if (difficulty !== undefined && existingVoteData.difficulty === null) {
            updates.push(`difficulty = $${i++}`)
            values.push(difficulty)
        }
        if (optimization !== undefined && existingVoteData.optimization === null) {
            updates.push(`optimization = $${i++}`);
            values.push(optimization);
        }
        if (enjoyment !== undefined && existingVoteData.enjoyment === null) {
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

module.exports = { getVotes, createOrUpdateVote };