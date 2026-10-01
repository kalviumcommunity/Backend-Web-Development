/**
 * utils/AppError.js
 *
 * A custom Error subclass used for operational errors (i.e. errors the app
 * intentionally throws, such as 404 Not Found or 403 Forbidden). The
 * isOperational flag lets the global error handler distinguish these from
 * unexpected programmer errors.
 */

'use strict';

class AppError extends Error {
  /**
   * @param {string} message    - Human-readable error description.
   * @param {number} statusCode - HTTP status code to send to the client.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode    = statusCode;
    this.isOperational = true;

    // Preserve a clean stack trace (V8 only).
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = AppError;
