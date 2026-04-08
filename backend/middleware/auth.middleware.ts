import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ message: "Unauthorized. Please log in." });
    } catch (error) {
        console.log(error, "Error is coming from auth middleware");
        res.status(500).json({ message: "Internal server error" });
    }
}