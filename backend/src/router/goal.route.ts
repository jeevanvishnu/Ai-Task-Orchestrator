import express from "express"
import { createGoal, getdashboard, getGoal, getGoalById, editGoal, regenerateGoal, editTask, deleteGoal, deleteDashboardGoal, getHistory , searchGoal } from "../controller/goal.controller.ts"
import { authMiddleware } from "../../middleware/auth.middleware.ts"

const router = express.Router()

router.get("/dashboard", authMiddleware, getdashboard)
router.post("/dashboard", authMiddleware, createGoal)
router.get("/goals", authMiddleware, getGoal)
router.get("/goals/:id", authMiddleware, getGoalById)
router.put("/goals/:id", authMiddleware, editGoal)
router.put("/goals/:id/regenerate", authMiddleware, regenerateGoal)
router.put("/goals/:id/task/:taskId", authMiddleware, editTask)
router.delete("/goals/:id/task/:taskId", authMiddleware, deleteGoal)
router.delete("/goals/:id", authMiddleware, deleteDashboardGoal)
router.get("/history", authMiddleware, getHistory)
router.get("/search", authMiddleware, searchGoal)

export default router