/**
 * Central error handler
 *
 * AppError lives in utils/
 * Configuration lives in config/
 */

const AppError = require('../utils/AppError');
const config = require('../config');

const NODE_ENV = config.nodeEnv;

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };

  // Only leak stack traces outside production.
  if (NODE_ENV !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};