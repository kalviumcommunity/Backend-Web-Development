const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, trim: true },
    year: { type: Number },
    summary: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
