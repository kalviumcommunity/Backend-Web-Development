
const express = require('express');

const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');

function createApp() {
  const app = express();

  app.use(express.json());

  // Resource-oriented post routes
  app.use('/', postRoutes);

  // Handle unknown routes consistently
  app.use((req, res) => {
    return res.status(404).json({
      ok: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  // Centralized error handler
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;

    if (status >= 500) {
      console.error('Internal server error:', err);
    }

    return res.status(status).json({
      ok: false,
      error: {
        code: status === 404
          ? err.code || 'NOT_FOUND'
          : 'INTERNAL_ERROR',
        message: status === 404
          ? err.message || 'Resource not found'
          : 'An unexpected error occurred',
      },
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData,
};