const express = require("express");
const bcrypt = require("bcrypt");
const { query } = require("../helpers/db.js");

const authRouter = express.Router()

authRouter.post("/register", async(req, res) => {
    // input values
    const { email, password, username } = req.body;
        console.log("started registering")
        try {
        const result = await query('SELECT * FROM users WHERE email=$1 OR username=$2', [email, username]);

        // if users are returned
        if (result.rows.length > 0) {
            return res.status(400).json({message: "email or username already exists"});
        }

        // password hashing with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // new user to db
        const newUser = await query(
            'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
            [email, hashedPassword, username]
            );
            console.log("New user created:", newUser.rows[0]);
            res.status(200).json({message: "New user registered"})
        } catch (error) {
            console.error("Error registering user", error);
            res.status(500).json({message: "Server error"})
        }
});

module.exports = { authRouter };