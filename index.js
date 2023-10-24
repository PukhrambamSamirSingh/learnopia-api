const express = require("express")
const connect = require("./database")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth")
const postRouter = require("./routes/post")
const userRouter = require("./routes/user")
const reviewRouter = require("./routes/review")

app.use(express.json())
app.use(cors({
    origin: "https://learnopia.onrender.com",
    credentials: true
}))
app.use(cookieParser())
dotenv.config()
const PORT = process.env.PORT
connect()


//routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/review", reviewRouter)

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})