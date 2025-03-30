const { query } = require("../helpers/db.js")
const express = require("express")
const jwt = require("jsonwebtoken")
const { compare, hash } = require("bcrypt")
const { verifyToken } = require("../helpers/verifyToken.js")


const userRouter = express.Router()



const generateToken = (user)=>{
    return jwt.sign({ users_id: user.user_id, username: user.username }, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
}

userRouter.post("/login", async (req, res) => {
    
    try {
        const { username, password } = req.body

        console.log(username, password)
        if (!username || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const userFromDb = await query(
            'SELECT * FROM users WHERE username = $1', [username]
        )

        if (userFromDb.rowCount === 0) {
            return res.status(401).json({ error: "Invalid credentials"})
        }

        const user = userFromDb.rows[0]
        
        // if (!await compare(password, user.password)) {
        //     return res.status(401).json({ error: "Passwords do not match"})
        // } 
        // 
        // !!!USE THIS WHEN PASSWORD IS HASHED!!!

        if (password !== user.password) {
            return res.status(401).json({ error: "Password do not match"})
        }

        const accessToken = generateToken(user)

        res.cookie("access_token", accessToken, {
            httpOnly: true,
        });
        res.status(200).json({
            users_id: user.user_id,
            username: user.username,
            accessToken,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Something went wrong with logging in"})
    }
    
})

userRouter.get("/profile", verifyToken, async (req, res) => {
    return res.status(200).json({
        message: "Hello profile",
    })
})

module.exports = {
    userRouter
}