const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();

  app.use(express.json());

  // Resource-based post routes
  app.use('/posts', postRoutes);

  // Safe internal-failure demo route
  app.get('/test/internal-error', controller.explode);

  // Handle unknown routes
  app.use((req, res) => {
    return http.sendError(res, 404, {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found'
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled application error:', err);

    if (res.headersSent) {
      return next(err);
    }

    return http.sendError(res, 500, {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong'
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