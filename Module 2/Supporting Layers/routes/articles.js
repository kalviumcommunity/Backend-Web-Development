/**
 * Articles router
 *
 * Uses validators from validators/, asyncHandler from utils/, and validateRequest
 * from utils/ to keep this file focused on routing and handler dispatch.
 */

const express = require('express');
const router = express.Router();
const asyncHandler = require('./../utils/asyncHandler');
const validateRequest = require('./../utils/validateRequest');
const { createArticle, updateArticle } = require('./../validators/article.validator');
const ctrl = require('./../controllers/articlesController');

router.get('/', asyncHandler(ctrl.list));

router.post(
  '/',
  ...createArticle,
  validateRequest,
  asyncHandler(ctrl.create)
);

router.patch(
  '/:id',
  ...updateArticle,
  validateRequest,
  asyncHandler(ctrl.update)
);

module.exports = router;
