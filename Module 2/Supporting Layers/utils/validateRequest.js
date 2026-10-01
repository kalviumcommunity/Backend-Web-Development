// utils/validateRequest.js
const { validationResult } = require('express-validator');
const AppError = require('./AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new AppError('Validation failed', 422);
    err.details = errors.array();
    return next(err);
  }
  next();
};