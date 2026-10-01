/**
 * Articles router.
 *
 * Validation chains are imported from validators/article.validator.js.
 * The validateRequest middleware lives in utils/validateRequest.js.
 * Async handlers are wrapped with utils/asyncHandler.js — no try/catch needed.
 */

'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articlesController');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../utils/validateRequest');
const { createArticle, updateArticle } = require('../validators/article.validator');

router.get('/', asyncHandler(ctrl.list));

router.post(
  '/',
  createArticle,
  validateRequest,
  asyncHandler(ctrl.create)
);

router.patch(
  '/:id',
  updateArticle,
  validateRequest,
  asyncHandler(ctrl.update)
);

module.exports = router;
