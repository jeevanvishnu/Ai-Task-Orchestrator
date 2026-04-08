import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import goal from "./router/goal.route.ts"
import connectDB from "./config/db.ts"
import auth from "./router/auth.router.ts"
import session from "express-session"
import passport from "passport"
import "./lib/passport.ts"


dotenv.config()

const PORT = process.env.PORT || 4001

const app = express()

app.use(cors({
    origin: "https://ai-task-orchestrator-git-main-jeevanvishnus-projects.vercel.app",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("trust proxy", 1);

app.use(session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, 
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    } 
}))
app.use(passport.initialize())
app.use(passport.session())

// routes setup 
app.use('/api', goal)
app.use('/api/auth', auth)


// app starting funtion
const startServer = () => {
    try {
        connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log("Server failed to start", error)
        process.exit(1)
    }
}

startServer()