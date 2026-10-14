const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe internal error testing route
  app.get('/test-error', controller.explode);

  // Handle unknown routes
  app.use((req, res) => {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const status = err.statusCode === 404 ? 404 : 500;

    return res.status(status).json({
      error: {
        code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
        message: status === 404
          ? 'Resource not found'
          : 'An internal error occurred'
      }
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};