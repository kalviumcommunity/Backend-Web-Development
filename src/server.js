const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/book.routes");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Kalvium Backend API is running!" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed, starting server anyway:", err.message);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (no DB)`));
  });
