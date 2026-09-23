const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/', postRoutes);
  app.get('/explode', controller.explode);

  app.use((req, res) => {
    return http.sendError(res, 404, 'NOT_FOUND', 'Route not found');
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.type === 'entity.parse.failed') {
      return http.sendError(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
    }

    const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;
    const code = status === 400 ? (err.code || 'BAD_REQUEST') : 'INTERNAL_ERROR';
    const message = status === 500 ? 'Something went wrong' : (err.message || 'Bad request');
    return http.sendError(res, status, code, message, status === 400 ? err.details : undefined);
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
