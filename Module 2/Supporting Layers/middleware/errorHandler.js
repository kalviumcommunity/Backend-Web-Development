/**
 * Central error handler — STARTER.
 *
 * Operational errors and environment configuration are imported from their layers.
 */

const config = require('../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body = { error: err.message || 'Internal Server Error' };

  if (err.details) body.details = err.details;

  // Only leak stack traces outside production.
  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};
