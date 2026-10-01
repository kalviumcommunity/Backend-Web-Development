/**
 * Central error handler — STARTER.
 *
 * PROBLEMS:
 *   - AppError is DEFINED again here (also defined in services/articlesService.js).
 *     After you create utils/AppError.js, delete both copies and import the shared one.
 *   - the NODE_ENV env var is read in places; it should come from config.nodeEnv.
 */

const AppError = require('./../utils/AppError');
const config = require('./../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };
  // For validation errors include details and don't expose stack traces.
  if (status === 422 && err.details) {
    body.details = err.details;
    return res.status(status).json(body);
  }

  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};
