
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./Errors/errorHandler');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

// Centralized error handling middleware
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
