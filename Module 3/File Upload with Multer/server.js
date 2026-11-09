
import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import jwt from "jsonwebtoken";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON request bodies
app.use(express.json());

// Demo login API
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Check demo credentials
  if (username !== "ada" || password !== "password") {
    return res.status(401).json({
      error: "Invalid username or password"
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      sub: "ada",
      role: "user"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256"
    }
  );

  return res.status(200).json({
    token: token
  });
});

// Serve uploaded images through their URLs
app.use("/uploads", express.static("uploads"));

// Mount upload routes
app.use("/api", uploadRoutes);

// Handle upload errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size must not exceed 5 MB"
      });
    }

    return res.status(400).json({
      error: err.message
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({
      error: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    error: "Internal server error"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
