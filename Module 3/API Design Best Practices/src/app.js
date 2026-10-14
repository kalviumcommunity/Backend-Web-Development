
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe internal-failure demo route
  app.get('/test-error', controller.explode);

  // Handle unknown routes
  app.use((req, res) => {
    return http.sendError(res, 404, {
      code: 'NOT_FOUND',
      message: 'Route not found'
    });
  });

  // Centralised error handler
  app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
      return next(err);
    }

    return http.sendError(res, err.statusCode || 500, {
      code: err.code || 'INTERNAL_ERROR',
      message: err.statusCode === 400
        ? 'Invalid request'
        : 'Something went wrong'
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
