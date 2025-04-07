const express = require("express");
const { getWRHistory } = require('../models/worldRecordModel.js');
const { query } = require("../helpers/db.js");
const wrHistoryRouter = express.Router();

const WRHistoryHandler = async (req, res) => {
    const { categoryId } = req.query; // gets id from query parameter

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
};

wrHistoryRouter.get('/wr-history', WRHistoryHandler);

module.exports = wrHistoryRouter;

