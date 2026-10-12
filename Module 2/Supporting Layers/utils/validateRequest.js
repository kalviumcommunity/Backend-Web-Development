/**
 * utils/validateRequest.js
 *
 * Express middleware that reads the results accumulated by express-validator
 * chains and short-circuits the request with a 422 Unprocessable Entity error
 * when validation fails. Place this after your validator chains in a route:
 *
 *   router.post('/', createArticle, validateRequest, asyncHandler(ctrl.create));
 */

'use strict';

const { validationResult } = require('express-validator');
const AppError = require('./AppError');

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 422));
  }
  next();
}

module.exports = validateRequest;
