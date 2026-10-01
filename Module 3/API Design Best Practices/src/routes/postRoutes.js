const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

// Specific routes before param routes
router.get('/explode', controller.explode);
router.get('/posts/explode', controller.explode);

// Public noun-based resource routes (when mounted at /posts or /)
router.get('/', controller.listPosts);
router.post('/', controller.createPost);
router.get('/posts', controller.listPosts);
router.post('/posts', controller.createPost);

router.get('/:id', (req, res, next) => {
  if (req.params.id === 'posts') return next();
  return controller.getPost(req, res);
});
router.get('/posts/:id', controller.getPost);

router.post('/:id/likes', controller.likePost);
router.post('/:id/like', controller.likePost);
router.post('/posts/:id/likes', controller.likePost);
router.post('/posts/:id/like', controller.likePost);

module.exports = router;
