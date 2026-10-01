/**
 * Articles router — STARTER (validation defined INLINE).
 *
 * PROBLEM: the validation chains and the validationResult check live right here
 * in the route file. They belong in validators/ (the chains) and utils/ (the
 * validateRequest helper).
 *
 * Validation and async error forwarding are provided by supporting layers.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('./../controllers/articlesController');
const asyncHandler = require('./../utils/asyncHandler');
const validateRequest = require('./../utils/validateRequest');
const { createArticle, updateArticle } = require('./../validators/article.validator');

router.get('/', asyncHandler(ctrl.list));

// INLINE chains — should move to validators/article.validator.js
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
