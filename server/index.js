require('dotenv').config();
const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path"); 

const { authRouter} = require("./routes/authentication.js")
const { modRouter } = require("./routes/mod.js")
const { userRouter } = require("./routes/user.js")
const { categoryRouter } = require("./routes/category.js")
const { wrHistoryRouter, addRecordRouter } = require("./routes/wrHistory.js");
const { votesRouter } = require("./routes/votes.js") 


const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const apiRouter = express.Router();
app.use("/api", apiRouter)

apiRouter.use("/mods", modRouter)
apiRouter.use("/auth", authRouter)
apiRouter.use("/user", userRouter)
apiRouter.use("/categories", categoryRouter)
apiRouter.use("/wr-history", wrHistoryRouter)
apiRouter.use("/add-world-record", addRecordRouter)
apiRouter.use("/votes", votesRouter)

app.use(express.static(path.join(__dirname, "..", "public")));

async function startServer() {

  const port = process.env.PORT || 3001;
  app.listen(port, function() {
    console.log(`Server is running on ${port}`);
  });
}

startServer();