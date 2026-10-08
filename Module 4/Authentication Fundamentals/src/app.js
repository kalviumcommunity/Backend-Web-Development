import express from "express";
import authRouter from "./src/routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
    console.error("Unexpected server error");

    res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "Internal server error"
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});