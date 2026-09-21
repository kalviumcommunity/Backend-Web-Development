
const express = require('express');

const controller = require('../controllers/postController');

const router = express.Router();

// List all posts
router.get('/posts', controller.listPosts);

// Fetch one post
router.get('/posts/:id', controller.getPost);

// Create one post
router.post('/posts', controller.createPost);

// Like one post
router.post('/posts/:id/likes', controller.likePost);

// Safe internal-error demo route
router.get('/demo/error', controller.demoError);

module.exports = router;