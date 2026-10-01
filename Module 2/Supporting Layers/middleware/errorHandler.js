/**
 * Central error handler — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED again here (also defined in services/articlesService.js).
 *     After you create utils/AppError.js, delete both copies and import the shared one.
 *   - environment configuration should come from config.nodeEnv.
 */

const config = require('./../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };

  // Only leak stack traces outside production.
  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};
