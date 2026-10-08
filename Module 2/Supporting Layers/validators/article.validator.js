const { body } = require('express-validator');

const createArticle = [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required')
];

const updateArticle = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('body').optional().notEmpty().withMessage('Body cannot be empty')
];

module.exports = { createArticle, updateArticle };