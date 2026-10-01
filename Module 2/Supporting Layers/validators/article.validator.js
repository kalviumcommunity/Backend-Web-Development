const { body } = require('express-validator');

exports.createArticle = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('body')
    .notEmpty()
    .withMessage('Body is required')
    .isLength({ max: 2000 })
    .withMessage('Body must be under 2000 characters'),
];

exports.updateArticle = [
  body('title').optional().notEmpty().trim(),
  body('body').optional().isLength({ max: 2000 }),
];
