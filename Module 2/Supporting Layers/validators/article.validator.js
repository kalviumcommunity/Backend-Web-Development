/**
 * validators/article.validator.js
 *
 * express-validator chains for article-related routes.
 * Import the named exports directly into the router — do NOT add any chains
 * in the route file itself.
 *
 * Usage in routes/articles.js:
 *   const { createArticle, updateArticle } = require('../validators/article.validator');
 *   router.post('/', createArticle, validateRequest, asyncHandler(ctrl.create));
 */

'use strict';

const { body } = require('express-validator');

/**
 * Validation chain for POST /articles.
 * Both title and body are required.
 */
const createArticle = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),

  body('body')
    .notEmpty()
    .withMessage('Body is required and must be under 2000 characters')
    .isLength({ max: 2000 }),
];

/**
 * Validation chain for PATCH /articles/:id.
 * Both fields are optional but must meet constraints when present.
 */
const updateArticle = [
  body('title')
    .optional()
    .notEmpty()
    .trim(),

  body('body')
    .optional()
    .isLength({ max: 2000 }),
];

module.exports = { createArticle, updateArticle };
