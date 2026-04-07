import express from "express";
import { login, refreshToken, register } from "../controller/auth.controller.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

export default router;