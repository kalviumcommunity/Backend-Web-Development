require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  // Malformed JSON sent to express.json()
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON'
      }
    });
  }

  if (error.status === 400) {
    return res.status(400).json({
      error: {
        code: error.code || 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }

  if (error.status === 401) {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }

  if (error.status === 409) {
    return res.status(409).json({
      error: {
        code: error.code || 'CONFLICT',
        message: error.message
      }
    });
  }

  // Do not log raw errors, passwords, or password hashes.
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});
