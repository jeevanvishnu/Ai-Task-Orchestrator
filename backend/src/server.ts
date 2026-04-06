import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import goal from "./router/goal.route.ts"
import connectDB from "./config/db.ts"

dotenv.config()

const PORT = process.env.PORT || 4001

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes setup 
app.use('/api',goal)

// app starting funtion
const startServer = () => {
    try {
        connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log("Server failed to start",error)
        process.exit(1)
    }
}

startServer()