import express from "express";
import { login, refreshToken, register , logout} from "../controller/auth.controller.ts";
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

router.get('/logout',logout)

export default router;