/**
 * Central error handler.
 *
 * AppError is imported from utils/AppError.js (no longer duplicated here).
 * nodeEnv is imported from config (no process.env read here).
 */

'use strict';

const AppError = require('./../utils/AppError');
const config   = require('./../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const body   = { error: err.message || 'Internal Server Error' };

  // Only leak stack traces outside production.
  if (config.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};

// Re-export so code that imported AppError from here keeps working.
module.exports.AppError = AppError;
