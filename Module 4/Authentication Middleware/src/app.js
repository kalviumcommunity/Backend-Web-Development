require('dotenv').config();
const express = require('express');
const authRoutes = require('./authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.error('Unhandled application error');
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`Authentication API listening on ${port}`));
}

module.exports = app;
