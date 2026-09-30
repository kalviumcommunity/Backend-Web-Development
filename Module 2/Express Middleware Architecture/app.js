/**
 * Express Middleware Architecture — Build the Pipeline
 *
 * This Express app already has TWO routers mounted (/posts and /users).
 */

const express = require('express');

// The two routers are already written and mounted for you.
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Custom middleware
const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const app = express();

// Built-in body parser so POST /posts can read req.body.
app.use(express.json());

// Global middleware — order matters
app.use(requestId);
app.use(logger);
app.use(timing);

// Two mounted routers
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

module.exports = app;