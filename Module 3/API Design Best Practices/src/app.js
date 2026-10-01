const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();
  app.use(express.json());

  // Mount post resource routes
  app.use('/posts', postRoutes);

  // Safe internal failure route for demo/testing
  app.get('/explode', controller.explode);

  // 404 handler for missing routes
  app.use((req, res) => {
    return http.sendNotFound(res, 'Route not found');
  });

  // Central error handling middleware to avoid leaking stack traces or internal errors
  app.use((err, req, res, next) => {
    console.error('Safe internal error logged:', err.message, err.stack);
    return http.sendInternalError(res, 'Something went wrong');
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
