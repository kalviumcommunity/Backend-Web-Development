/**
 * Article validation chains
 *
 * Each chain is an array of express-validator validators that can be used
 * as middleware in the route file.
 */

const { body } = require('express-validator');

exports.createArticle = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('body').notEmpty().isLength({ max: 2000 }).withMessage('Body is required and must be under 2000 characters')
];

exports.updateArticle = [
  body('title').optional().notEmpty().trim(),
  body('body').optional().isLength({ max: 2000 })
];
