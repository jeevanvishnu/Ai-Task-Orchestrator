import type { Request, Response } from "express";
import Goal from "../model/gaols.mondel.ts";
import { prompt } from "../lib/prompt.ts";
import User from "../model/user.model.ts";  
import dotenv from "dotenv";
dotenv.config();
// Extending Request to include Passport's user

export const getdashboard = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 })
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
    if (!text) return "";
    return text
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .replace(/\t/g, " ")
        .replace(/\r?\n|\r/g, " ")
        .trim();
};

export const createGoal = async (req: any, res: Response) => {
    console.log("I am here");
    try {
        const { goal } = req.body;
        const userId = req.user._id; 

        if (!goal) {
            return res.status(400).json({ message: "Goal is required" });
        }


     if (!process.env.OPENAPI_KEY) {
         console.error("ERROR: OPENAPI_KEY is not defined in environment variables!");
     }

     const response = await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${process.env.OPENAPI_KEY || ""}`,
            'Content-Type':'application/json'
           
        },
        body:JSON.stringify({
            model:"openai/gpt-oss-20b:free",
            messages:[
                {
                    role:'user',
                    content:prompt + "\n\nUser Goal: " + goal,
                }
            ]
        })
     })

     const result = await response.json();

     if (!response.ok) {
         throw new Error(result.error?.message || "OpenRouter API error");
     }

     const rawText = result?.choices?.[0]?.message?.content;
     
     if (!rawText) {
         throw new Error("AI returned an empty response. Please try again.");
     }

     const cleanedText = cleanRoadmapResponse(rawText);

     let parsedResponse;
     try {
         parsedResponse = JSON.parse(cleanedText);
     } catch (e) {
         console.error("Failed to parse AI response:", cleanedText);
         throw new Error("AI returned invalid JSON. Please try again.");
     }

        if (parsedResponse.tasks && Array.isArray(parsedResponse.tasks)) {
            
            const tasksToSave = parsedResponse.tasks.map((task: any) => ({
                heading: task.heading,
                title: task.title,
                description: task.description,
            }));

            const savedTasks = await Goal.create(
                {
                    user: userId, 
                    title: goal,
                    goal: tasksToSave
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

export const getGoal = async (req:any, res: Response) => {
    try {
        const userId = req.user._id;
        const goals = await Goal.find({ user: userId })
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

export const getGoalById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const goal = await Goal.findOne({ _id: id, user: userId });
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

export const editGoal = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user._id;
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: id, user: userId },
            { title },
            { returnDocument: "after" }
        );
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

export const regenerateGoal = async (req: any, res: Response) => {

    try {
        const { id } = req.params;
        const userId = req.user._id;
        const goal = await Goal.findOne({ _id: id, user: userId });
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" })
        }
       if (!process.env.OPENAPI_KEY) {
           console.error("ERROR: OPENAPI_KEY is not defined in environment variables!");
       }

       const response = await fetch('https://openrouter.ai/api/v1/chat/completions',{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${process.env.OPENAPI_KEY || ""}`,
            'Content-Type':'application/json',
          
        },
        body:JSON.stringify({
            model:'openai/gpt-oss-20b:free',
            messages:[
                {
                    role:'user',
                    content:prompt + "\n\nUser Goal: " + goal.title,
                }
            ]
        })
       })

       const result = await response.json();

       if (!response.ok) {
           throw new Error(result.error?.message || "OpenRouter API error");
       }

       const rawText = result?.choices?.[0]?.message?.content;
       
       if (!rawText) {
           throw new Error("AI returned an empty response. Please try again.");
       }

       const cleanedText = cleanRoadmapResponse(rawText);
       
       let parsedResponse;
       try {
           parsedResponse = JSON.parse(cleanedText);
       } catch (e) {
           console.error("Failed to parse AI response:", cleanedText);
           throw new Error("AI returned invalid JSON. Please try again.");
       }
        if (parsedResponse.tasks && Array.isArray(parsedResponse.tasks)) {
            const tasksToSave = parsedResponse.tasks.map((task: any) => ({
                heading: task.heading,
                title: task.title,
                description: task.description,
            }));
            const updatedGoal = await Goal.findOneAndUpdate(
                { _id: id, user: userId },
                { goal: tasksToSave },
                { returnDocument: "after" }
            );
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

export const editTask = async (req: any, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user._id;
        
        const updateFields: any = {};
        if (title !== undefined) updateFields["goal.$.title"] = title;
        if (description !== undefined) updateFields["goal.$.description"] = description;
        if (status !== undefined) updateFields["goal.$.status"] = status;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: id, user: userId, "goal._id": taskId },
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

export const deleteGoal = async (req: any, res: Response) => {
    try {
        const { id, taskId } = req.params;
        const userId = req.user._id;
        const deletedGoal = await Goal.findOneAndUpdate(
            { _id: id, user: userId },
            { $pull: { goal: { _id: taskId } } },
            { returnDocument: "after" }
        );
        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" })
        }
        res.status(200).json({ deletedTask: deletedGoal })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// write a function to delete entire goal by id
export const deleteDashboardGoal = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const deletedGoal = await Goal.findOneAndDelete({ _id: id, user: userId });
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

export const getHistory = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

        const inprogress = await Goal.find({ user: userId, "goal.status": "in_progress" });
        const completed = await Goal.find({ user: userId, "goal.status": "completed" });
        
        res.status(200).json({ goals, inprogress, completed })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// write a fuction to search goal by title

export const searchGoal = async (req: any, res: Response) => {
    try {
        const query = req.query.query as string;
        const userId = req.user._id;
        if (!query) {
             return res.status(400).json({ message: "Search query is required" });
        }
        const goals = await Goal.find({
            user: userId,
            title: { $regex: query, $options: "i" }
        });
        res.status(200).json({ goals })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


// write a fuction of setting page

export const getSetting = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const updateSetting = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { returnDocument: "after" });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ updatedUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}