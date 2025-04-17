const express = require("express");
const votesRouter = express.Router();
const pool = require('../helpers/db.js');
const { verifyToken } = require('../helpers/verifyToken')
const votesModel = require("../models/votesModel");
const jwt = require("jsonwebtoken");

votesRouter.post("/:categoryId", verifyToken, async (req, res) => {
    try {
        const userId = req.user.user_id
        const categoryId = req.params.categoryId
        const { difficulty, optimization, enjoyment } = req.body

        const vote = await votesModel.createOrUpdateVote({
            difficulty, optimization, enjoyment, user_id: userId, category_id: categoryId
        })
        res.status(201).json(vote)
    } catch (error) {
        console.error("Error with voting", error)
        res.status(500).json({ error: "Failed save the vote"})
    }
})

votesRouter.get("/:categoryId",verifyToken,async (req, res) => {
    try {
        const userId = req.user.user_id
        const categoryId = req.params.categoryId
        const votes = await votesModel.getVotes(userId, categoryId)
        res.json(votes)
    } catch (error) {
        console.error("Error fetching votes:", error)
        res.status(500).json({ error: "Fetch failed."})
    }
})

module.exports = { votesRouter };