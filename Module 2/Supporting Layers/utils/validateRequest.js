/**
 * validateRequest — middleware that checks validation results
 *
 * Call this after all validation chain middleware.
 * If any validation failed, throws AppError(422).
 * Otherwise calls next().
 */

const { validationResult } = require('express-validator');
const AppError = require('./AppError');

module.exports = function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 422));
  }
  next();
};
