/**
 * Central error handler — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED again here (also defined in services/articlesService.js).
 *     After you create utils/AppError.js, delete both copies and import the shared one.
 *   - process.env.NODE_ENV is read directly here. It should come from config.nodeEnv.
 */

// TODO: Remove the duplicated AppError definition.
// TODO: Import the shared AppError from utils/AppError.js.
const AppError = require('../utils/AppError');

// TODO: Remove the direct process.env.NODE_ENV read.
// TODO: Import config from config/index.js.
const config = require('../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };

  // Only leak stack traces outside production.
  // TODO: Use config.nodeEnv instead of NODE_ENV.
  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};