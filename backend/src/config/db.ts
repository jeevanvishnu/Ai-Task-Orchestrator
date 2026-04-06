import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/task-orchestrator")
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
    }
}

export default connectDB
