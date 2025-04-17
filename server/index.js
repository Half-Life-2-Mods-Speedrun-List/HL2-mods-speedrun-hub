require('dotenv').config();
const express = require("express")
const cors = require("cors")

const { authRouter} = require("./routes/authentication.js")
const cookieParser = require("cookie-parser")
const { modRouter } = require("./routes/mod.js")
const { userRouter } = require("./routes/user.js")
const { categoryRouter } = require("./routes/category.js")
const { wrHistoryRouter, addRecordRouter } = require("./routes/wrHistory.js");
const { votesRouter } = require("./routes/votes.js") 


const app = express()

app.use(cookieParser())
app.use(cors({
  origin: ["http://127.0.0.1:5500","http://localhost:5500"],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/mods", modRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/categories", categoryRouter)
app.use("/wr-history", wrHistoryRouter)
app.use("/add-world-record", addRecordRouter)
app.use("/votes", votesRouter)


app.get('/', (req, res) => {
    res.send('change the address to find content');
});

async function startServer() {

  const port = process.env.PORT || 3001;
  app.listen(port, function() {
    console.log(`Server is running on ${port}`);
  });
}

startServer();