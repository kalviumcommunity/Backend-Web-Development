const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe internal error demonstration route
  app.get('/test/error', controller.explode);

  // Handle unknown routes with a consistent error response
  app.use((req, res) => {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};
