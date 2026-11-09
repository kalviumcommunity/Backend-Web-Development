
import express from "express";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Authenticated image upload route
router.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  (req, res) => {

    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    // Return the uploaded image URL
    return res.status(201).json({
      url: `/uploads/${req.file.filename}`
    });
  }
);

export default router;
