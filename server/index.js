require('dotenv').config();
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const { authRouter} = require("./routes/authentication.js")
const cookieParser = require("cookie-parser")
const { modRouter } = require("./routes/mod.js")
const { userRouter } = require("./routes/user.js")
const { connectDB } = require("./helpers/db.js");

const app = express()

app.use(cookieParser())
app.use(cors({
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/mods", modRouter)
app.use("/user", userRouter)
app.use("/auth", authRouter)


app.get('/', (req, res) => {
    res.send('change the address to find content');
  });

  async function startServer() {
    await connectDB();

    const port = process.env.PORT || 3001;
    app.listen(port, function() {
      console.log(`Server is running on ${port}`);
    });
  }

startServer();