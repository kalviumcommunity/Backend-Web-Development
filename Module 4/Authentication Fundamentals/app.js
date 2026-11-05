const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Authentication API is running"
  });
});

module.exports = app;