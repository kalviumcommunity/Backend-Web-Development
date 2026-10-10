const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/', postRoutes);
  app.get('/_demo/internal-error', controller.explode);

  app.use((req, res) => {
    return http.sendError(res, 404, 'ROUTE_NOT_FOUND', 'Route not found');
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    const isBadRequest = err.statusCode === 400 || err.status === 400;
    const status = isBadRequest ? 400 : 500;
    const code = status === 400 ? (err.publicCode || 'BAD_REQUEST') : 'INTERNAL_ERROR';
    const message = status === 400 ? (err.publicMessage || 'Invalid request') : 'An unexpected error occurred';
    if (status === 500) console.error(err);
    return http.sendError(res, status, code, message);
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
