require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const AppError = require('./errors/AppError');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
  const invalidJson = error instanceof SyntaxError && error.status === 400 && 'body' in error;
  const controlled = error instanceof AppError;
  const status = invalidJson ? 400 : controlled ? error.status : 500;
  if (!controlled && !invalidJson) console.error(error);
  res.status(status).json({
    error: {
      code: invalidJson ? 'INVALID_JSON' : controlled ? error.code : 'INTERNAL_ERROR',
      message: invalidJson ? 'Request body contains invalid JSON' : controlled ? error.message : 'Internal server error',
    },
  });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`API listening on ${port}`));
}

module.exports = app;