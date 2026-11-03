
require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

// Error-handling middleware
app.use((error, req, res, next) => {
  const status = Number(error.status || 500);
  const code = status < 500 && error.code
    ? error.code
    : 'INTERNAL_ERROR';
  const message = status < 500
    ? error.message
    : 'Internal server error';

  if (status >= 500) {
    console.error(error.message);
  }

  res.status(status).json({
    error: {
      code,
      message
    }
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`API listening on ${port}`);
});



