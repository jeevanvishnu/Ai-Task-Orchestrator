import type { Request, Response, NextFunction } from "express";
import { verifyAcessToken } from "../src/config/jwt.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = verifyAcessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error,"Error is comming from auth middleware");
        res.status(500).json({ message: "Internal server error" });
    }
}