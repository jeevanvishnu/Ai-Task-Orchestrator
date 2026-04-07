import express from "express"
import { createGoal, getdashboard, getGoal, getGoalById, editGoal, regenerateGoal, editTask , deleteGoal, deleteDashboardGoal } from "../controller/goal.controller.ts"

const router = express.Router()

router.get("/dashboard", getdashboard)
router.post("/dashboard", createGoal)
router.get("/goals", getGoal)
router.get("/goals/:id", getGoalById)
router.put("/goals/:id", editGoal)
router.put("/goals/:id/regenerate", regenerateGoal)
router.put("/goals/:id/task/:taskId", editTask)
router.delete("/goals/:id/task/:taskId", deleteGoal)
router.delete("/goals/:id", deleteDashboardGoal)

export default router