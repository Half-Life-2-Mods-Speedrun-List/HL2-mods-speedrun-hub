const express = require("express");
const { getWRHistory, parseTimeToMilliseconds } = require('../models/wrModel.js');
const wrHistoryRouter = express.Router();
const addRecordRouter = express.Router()
const pool = require('../helpers/db.js');

wrHistoryRouter.get("/:categoryId", async (req, res) => {
    const { categoryId } = req.params; 

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }
    try {
        // calling model method to get WR history
        const wrHistory = await getWRHistory(categoryId);
        res.status(200).json(wrHistory);
    } catch (error) {
        console.error("Error fetching WR history:", error);
        res.status(500).json({ error: "Failed to fetch WR history" });
    }
});

const addWorldRecord = async (runnerName, recordTime, recordDate, userId, categoryId) => {
    try {
        // adding new record to world_records table
        const result = await pool.query(
            `INSERT INTO world_records (runner_name, record_time, record_date, user_id, category_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [runnerName, recordTime, recordDate, userId, categoryId]
        );
        return result.rows[0]; // return the added record
    } catch (error) {
        console.error("Error inserting new world record:", error);
        throw new Error("Failed to insert world record");
    }
};

// route
addRecordRouter.post('/add-world-record', async (req, res) => {
    const { runnerName, recordTime, recordDate, userId, categoryId } = req.body;

    if (!runnerName || !recordTime || !recordDate || !userId || !categoryId) {
        return res.status(400).send('Missing required fields');
    }

    try {
        // conversions
        const timeInMilliseconds = parseTimeToMilliseconds(recordTime);
        if (timeInMilliseconds === null) {
            return res.status(400).send('Invalid record time format');
        }
        const newRecord = await addWorldRecord(runnerName, timeInMilliseconds, recordDate, userId, categoryId);
        res.status(201).json({
            message: 'World record added successfully',
            record: newRecord
        });
    } catch (error) {
        res.status(500).send('Failed to add world record');
    }
});

module.exports = { wrHistoryRouter, addRecordRouter };

