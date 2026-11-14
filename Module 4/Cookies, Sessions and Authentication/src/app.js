require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { cookieSecret } = require('./config/cookieConfig');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser(cookieSecret));
app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const isBadRequest = error.status === 400;
  res.status(isBadRequest ? 400 : 500).json({
    error: {
      code: isBadRequest ? 'INVALID_REQUEST' : 'INTERNAL_ERROR',
      message: isBadRequest ? 'Invalid request' : 'Internal server error',
    },
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API listening on ${port}`));
