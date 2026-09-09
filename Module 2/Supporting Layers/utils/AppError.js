/**
 * Custom AppError class
 *
 * Extends Error with statusCode and isOperational flag.
 * isOperational marks errors that are expected (validation, auth, etc)
 * vs programming errors that should crash or be logged.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = AppError;
