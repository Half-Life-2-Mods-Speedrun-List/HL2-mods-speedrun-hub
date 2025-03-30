require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { modRouter } = require("./routes/mod.js")
const { userRouter } = require("./routes/user.js")
require('dotenv').config();

const app = express()

app.use(cookieParser())
app.use(cors({
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/mods", modRouter)
app.use("/user", userRouter)

app.get('/', (req, res) => {
    res.send('change the address to find content');
  });


const port = process.env.PORT
app.listen(port)