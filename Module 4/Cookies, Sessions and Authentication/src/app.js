
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

// Validate required environment variables
if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET.length < 32) {
  throw new Error('COOKIE_SECRET must contain at least 32 characters');
}

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Session Authentication API is running'
  });
});

// Authentication routes
app.use('/auth', authRoutes);

// Handle invalid JSON request bodies
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON'
      }
    });
  }

  console.error('Server error:', error);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// Start server
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
