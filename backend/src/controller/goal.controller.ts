import type { Request, Response } from "express";
import Goal from "../model/gaols.mondel.ts";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "../lib/prompt.ts";

export const getdashboard = async (req: Request, res: Response) => {
    try {
        const goals = await Goal.find().sort({ createdAt: -1 })
        if (!goals) {
            return res.status(404).json({ message: "Goals not found" })
        }
        res.status(200).json({ goals })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// Helper to clean AI roadmap response and handle formatting
const cleanRoadmapResponse = (text: string) => {
    return text
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .replace(/\t/g, " ") 
        .replace(/\r?\n|\r/g, " ") 
        .trim();
};

export const createGoal = async (req: Request, res: Response) => {
    try {
        const { goal } = req.body;
        if (!goal) {
            return res.status(400).json({ message: "Goal is required" });
        }

        const genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string
        });

        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview", 
            contents: prompt + "\n\nUser Goal: " + goal,
        });

        const rawText = result.text;
        const cleanedText = cleanRoadmapResponse(rawText);

        const parsedResponse = JSON.parse(cleanedText);

        if (parsedResponse.tasks && Array.isArray(parsedResponse.tasks)) {
            
            const tasksToSave = parsedResponse.tasks.map((task: any) => ({
                heading: task.heading,
                title: task.title,
                description: task.description,
            }));

            const savedTasks = await Goal.create(
                {
                    title:goal,
                    goal:tasksToSave
                }
            );

            res.status(201).json({
                message: "Goal Roadmap generated and stored successfully",
                count: savedTasks.goal.length,
                tasks: savedTasks
            });
        } else {
            throw new Error("AI response structure is invalid (missing tasks array)");
        }

    } catch (error: any) {
        console.error("Error in AI Goal Creation:", error);
        res.status(500).json({ 
            message: "Internal server error during roadmap generation", 
            error: error.message 
        });
    }
}

// write a function to get goal 

export const getGoal = async (req: Request, res: Response) => {
    try {
        const goals = await Goal.find()
        if (!goals) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ goals })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}




// write a function to get goal by id

export const getGoalById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ goal })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// write a function edit goal by id

export const editGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const updatedGoal = await Goal.findByIdAndUpdate(id, { title }, { returnDocument: "after" });
        if (!updatedGoal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ updatedGoal })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// write a fuction to regenerate goal by id

export const regenerateGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const goal = await Goal.findById(id);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        const genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string
        });
        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview", 
            contents: prompt + "\n\nUser Goal: " + goal.title,
        });
        const rawText = result.text;
        const cleanedText = cleanRoadmapResponse(rawText);
        const parsedResponse = JSON.parse(cleanedText);
        if (parsedResponse.tasks && Array.isArray(parsedResponse.tasks)) {
            const tasksToSave = parsedResponse.tasks.map((task: any) => ({
                heading: task.heading,
                title: task.title,
                description: task.description,
            }));
            const updatedGoal = await Goal.findByIdAndUpdate(id, { goal: tasksToSave }, { returnDocument: "after" });
            res.status(200).json({ updatedGoal })
        } else {
            throw new Error("AI response structure is invalid (missing tasks array)");
        }
    } catch (error: any) {
        console.error("Error in AI Goal Regeneration:", error);
        res.status(500).json({ 
            message: "Internal server error during roadmap regeneration", 
            error: error.message 
        });
    }
}

// write a funtion to edit task by id

export const editTask = async (req: Request, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const { title, description, status } = req.body;
        
        const updateFields: any = {};
        if (title !== undefined) updateFields["goal.$.title"] = title;
        if (description !== undefined) updateFields["goal.$.description"] = description;
        if (status !== undefined) updateFields["goal.$.status"] = status;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: id, "goal._id": taskId },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!updatedGoal) {
            return res.status(404).json({ message: "Goal or task not found" });
        }

        res.status(200).json({ updatedTask: updatedGoal });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// write a function to delete goal by id

export const deleteGoal = async (req: Request, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const deletedGoal = await Goal.findByIdAndUpdate(
            id,
            { $pull: { goal: { _id: taskId } } },
            { returnDocument: "after" }
        );
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        // Send back the updated document
        res.status(200).json({ deletedTask: deletedGoal })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// write a function to delete entire goal by id
export const deleteDashboardGoal = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedGoal = await Goal.findByIdAndDelete(id);
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ deletedGoal })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// write a funciton  get history of goals

export const getHistory = async (req: Request, res: Response) => {
    try {
        const goals = await Goal.find().sort({ createdAt: -1 });

        const inprogress = await Goal.find({ "goal.status": "in_progress" });
        const completed = await Goal.find({ "goal.status": "completed" });
        
        if (!goals) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ goals, inprogress, completed })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// write a fuction to search goal by title

export const searchGoal = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        if (!query) {
             return res.status(400).json({ message: "Search query is required" });
        }
        const goals = await Goal.find({ title: { $regex: query, $options: "i" } });
        res.status(200).json({ goals })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// write  a fuction to setting of goal

