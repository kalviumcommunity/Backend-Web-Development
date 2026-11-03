const { body, param } = require('express-validator');

const createArticle = [
  body().isObject().withMessage('Request body must be an object')
];

const updateArticle = [
  param('id')
    .isInt()
    .withMessage('Article ID must be a number'),

  body().isObject().withMessage('Request body must be an object')
];

module.exports = {
  createArticle,
  updateArticle
};