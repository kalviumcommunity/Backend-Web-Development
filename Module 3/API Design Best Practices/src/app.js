const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe route used to demonstrate internal error handling.
  app.get('/demo/error', controller.explode);

  // Handle unknown routes consistently.
  app.use((req, res) => {
    return res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  // Centralized error handler.
  // Internal error details are logged on the server but never exposed
  // to the API client.
  app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    if (statusCode === 404) {
      return res.status(404).json({
        error: {
          code: err.code || 'NOT_FOUND',
          message: err.message || 'Resource not found'
        }
      });
    }

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong'
      }
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
  resetData
};