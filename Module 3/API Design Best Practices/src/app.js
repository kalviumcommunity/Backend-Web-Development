
const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');

function createApp() {
  const app = express();

  // Parse incoming JSON request bodies
  app.use(express.json());

  // Resource-oriented post routes
  // GET    /posts
  // GET    /posts/:id
  // POST   /posts
  // POST   /posts/:id/likes
  app.use('/posts', postRoutes);

  // Safe internal-failure demo route
  app.get('/explode', controller.explode);

  // Handle invalid JSON request bodies
  app.use((err, req, res, next) => {
    if (
      err instanceof SyntaxError &&
      err.status === 400 &&
      'body' in err
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'Request body contains invalid JSON',
        },
      });
    }

    next(err);
  });

  // Handle unknown routes
  app.use((req, res) => {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    });
  });

  // Centralized error handler
  // Safe validation errors return 400.
  // All unexpected internal errors return a generic 500.
  app.use((err, req, res, next) => {
    // Log diagnostic details on the server only
    console.error(err);

    if (res.headersSent) {
      return next(err);
    }

    // Handle our expected validation errors
    if (
      err.statusCode === 400 &&
      err.code === 'VALIDATION_ERROR'
    ) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: err.message,
        },
      });
    }

    // Never expose stack traces, SQL, or internal error details
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
      },
    });
  });

  return app;
}

// Start the server when this file is executed directly
if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData,
};

