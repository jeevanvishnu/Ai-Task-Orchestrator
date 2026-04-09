import mongoose from "mongoose";
import "dotenv/config"
import dns from "dns"

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    const URL = process.env.MONGODB_URL


    try {
        await mongoose.connect(URL!)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
    }
}

export default connectDB
