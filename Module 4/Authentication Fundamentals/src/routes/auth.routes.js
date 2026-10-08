import express from "express";
import {
    registerUser,
    loginUser
} from "../services/auth.service.js";
import { serializeUser } from "../services/user.serializer.js";

const router = express.Router();

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            !isNonEmptyString(name) ||
            !isNonEmptyString(email) ||
            !isNonEmptyString(password)
        ) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Name, email, and password are required"
                }
            });
        }

        const user = await registerUser({
            name,
            email,
            password
        });

        return res.status(201).json(serializeUser(user));
    } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
            return res.status(409).json({
                error: {
                    code: "EMAIL_EXISTS",
                    message: "Email already exists"
                }
            });
        }

        console.error("Registration failed");

        return res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Internal server error"
            }
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            !isNonEmptyString(email) ||
            !isNonEmptyString(password)
        ) {
            return res.status(400).json({
                error: {
                    code: "INVALID_INPUT",
                    message: "Email and password are required"
                }
            });
        }

        const user = await loginUser({
            email,
            password
        });

        return res.status(200).json(serializeUser(user));
    } catch (error) {
        if (error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Invalid email or password"
                }
            });
        }

        console.error("Login failed");

        return res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Internal server error"
            }
        });
    }
});

export default router;