require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { modRouter } = require("./routes/mod.js")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/mods", modRouter)


app.get('/', (req, res) => {
    res.send('change the address to find content');
  });


const port = process.env.PORT
app.listen(port)