
const express = require("express");
const authServices = require("../services/authService");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const user = await authServices.register(req.body);

        return res.status(201).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const user = await authServices.login(req.body);

        return res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
