const express = require("express");
const { getWRHistory } = require('../models/wrModel.js');
const wrHistoryRouter = express.Router();

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

module.exports = { wrHistoryRouter };

