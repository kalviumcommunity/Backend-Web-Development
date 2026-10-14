
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/', postRoutes);

  // Safe route for demonstrating an internal server error.
  app.get('/explode', controller.explode);

  // Standard response for routes that do not exist.
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      }
    });
  });

  // Standard response for unexpected errors, including invalid JSON.
  app.use((err, req, res, next) => {
    console.error('Request error:', err.message);

    if (res.headersSent) {
      return next(err);
    }

    const isBadJson =
      err instanceof SyntaxError &&
      err.status === 400 &&
      'body' in err;

    if (isBadJson) {
      return res.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'Request body contains invalid JSON'
        }
      });
    }

    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
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
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};
