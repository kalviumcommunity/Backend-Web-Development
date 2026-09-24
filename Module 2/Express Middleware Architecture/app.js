/**
 * Express Middleware Architecture — Build the Pipeline
 *
 * Implements three global middleware:
 *   1) requestId — attaches a UUID to req (and the X-Request-Id header)
 *   2) logger    — logs method, path, and status
 *   3) timing    — logs how many milliseconds the request took
 *
 * Also demonstrates per-route mounting by using auditWrite on POST /posts only.
 */

const express = require('express');

// Routers
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

// Custom middleware
const requestId = require('./middleware/requestId');
const logger = require('./middleware/logger');
const timing = require('./middleware/timing');

const app = express();

// Built-in body parser so POST /posts can read req.body
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// GLOBAL middleware pipeline — order matters
app.use(requestId);   // 1. stamp req.id + header
app.use(logger);      // 2. log method/path/status
app.use(timing);      // 3. log duration
// ─────────────────────────────────────────────────────────────

// Routers
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

module.exports = app;
