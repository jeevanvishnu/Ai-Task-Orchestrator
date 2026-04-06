import mongoose from "mongoose";


const goalSchema = new mongoose.Schema({
    title:String,
   goal:[{
    heading: String,
    title: String,
    description: String,
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    createdAt: Date,
    updatedAt: Date,
   }]
}, { timestamps: true })

const Goal = mongoose.model("Goal", goalSchema)

export default Goal