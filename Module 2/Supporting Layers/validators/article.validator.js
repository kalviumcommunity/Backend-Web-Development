const { body } = require('express-validator');

const createArticle = [
  body('title')
    .isString().withMessage('Title must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('body')
    .isString().withMessage('Body must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Body is required')
    .isLength({ max: 2000 }).withMessage('Body must be under 2000 characters')
];

const updateArticle = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .bail()
    .trim()
    .notEmpty().withMessage('Title cannot be empty'),
  body('body')
    .optional()
    .isString().withMessage('Body must be a string')
    .bail()
    .isLength({ max: 2000 }).withMessage('Body must be under 2000 characters')
];

module.exports = { createArticle, updateArticle };
