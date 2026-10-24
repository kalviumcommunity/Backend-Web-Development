
/**
 * Express Middleware Architecture — Observability Shield
 */

const express = require('express');

// Existing routers
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Global middleware
const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Global observability middleware — order matters!
app.use(requestId);
app.use(logger);
app.use(timing);

// Routers
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

module.exports = app;
