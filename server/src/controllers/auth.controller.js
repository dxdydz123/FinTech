import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email.trim(),
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.trim(),
                password: hashedPassword,
            },
        });

        return res.status(201).json({
            message: "User registered successfully",
            userId: user.id,
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            message: "Registration failed",
        });
    }
};



export const login = async (req, res) => {
    console.log("LOGIN BODY:", req.body);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email.trim(),
            },
        });

        console.log("FOUND USER:", user ? user.email : null);

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("PASSWORD MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        console.log("JWT_SECRET:", !!process.env.JWT_SECRET);
        console.log("JWT_REFRESH_SECRET:", !!process.env.JWT_REFRESH_SECRET);

        const payload = { id: user.id, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {

        return res.status(200).json({
            message: "Logged out successfully",
            userId: req.user.id,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
        });
    }
};



