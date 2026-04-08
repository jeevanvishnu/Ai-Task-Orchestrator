import express from "express";
import { login, refreshToken, register } from "../controller/auth.controller.ts";
import passport from "../lib/passport.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), (req, res) => {
    res.redirect("http://localhost:5173");
});



router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ message: "Logged out successfully" });
        });
    });
});

export default router;