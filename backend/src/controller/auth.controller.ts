import type { Request, Response } from "express";
import User from "../model/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAcessToken, generateRefreshToken } from "../config/jwt.ts";
import { verifyRefreshToken } from "../config/jwt.ts";


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const acessToken = generateAcessToken(newUser._id.toString());
        const refreshToken = generateRefreshToken(newUser._id.toString());
        res.status(201).json({ user: newUser, acessToken , refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
       const acessToken = generateAcessToken(user._id.toString());
       const refreshToken = generateRefreshToken(user._id.toString());
       res.status(200).json({ user, acessToken , refreshToken });
    } catch (error) {
        console.log(error,"error in login");
        res.status(500).json({ message: "Error logging in" });
    }
};

// write a fuction to refresh token

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(401).json({ message: "Refresh token is required" });
        }
        const decodedToken = verifyRefreshToken(refreshToken);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const acessToken = generateAcessToken(decodedToken.userId);
        res.status(200).json({ acessToken });
    } catch (error) {
        console.log(error,"error in refresh token");
        res.status(500).json({ message: "Error refreshing token" });
    }
};