import type { Response } from "express";
import User from "../model/user.model.ts";
import bcrypt from "bcrypt";

export const register = async (req: any, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: any = await User.create({ name, email, password: hashedPassword });
        
        // Log in the user after registration
        req.login(newUser, (err: any) => {
            if (err) return res.status(500).json({ message: "Error logging in after registration" });
            res.status(201).json({ user: newUser });
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user: any = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Log in the user and create session
        req.login(user, (err: any) => {
            if (err) return res.status(500).json({ message: "Error in creating session" });
            res.status(200).json({ user });
        });
    } catch (error) {
        console.log(error, "error in login");
        res.status(500).json({ message: "Error logging in" });
    }
};

export const logout = async (req: any, res: Response) => {
    req.logout((err: any) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "User logged out successfully" });
        });
    });
};

export const refreshToken = async (req: any, res: Response) => {
    try {
        if (req.isAuthenticated()) {
            return res.status(200).json({ user: req.user, message: "Session refreshed" });
        }
        res.status(401).json({ message: "Session expired" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};