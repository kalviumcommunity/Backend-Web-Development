const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe internal-failure route for testing/demo.
  app.get('/internal-error', controller.explode);

  // Handle unknown routes consistently.
  app.use((req, res) => {
    return http.sendError(
      res,
      404,
      'NOT_FOUND',
      'Route not found'
    );
  });

  // Centralized error handler.
  app.use((err, req, res, next) => {
    console.error(err);

    if (err.statusCode === 404) {
      return http.sendError(
        res,
        404,
        err.code || 'NOT_FOUND',
        err.message || 'Resource not found'
      );
    }

    return http.sendError(
      res,
      500,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred'
    );
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