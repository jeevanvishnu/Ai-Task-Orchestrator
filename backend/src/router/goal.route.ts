import express from "express"
import { createGoal, getdashboard, getGoal, getGoalById } from "../controller/goal.controller.ts"

const router = express.Router()

router.get("/dashboard", getdashboard)
router.post("/dashboard", createGoal)
router.get("/goals", getGoal)
router.get("/goals/:id", getGoalById)

export default router