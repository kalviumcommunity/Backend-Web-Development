const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

// Get all posts
router.get('/', controller.listPosts);

// Get one post
router.get('/:id', controller.getPost);

// Create a post
router.post('/', controller.createPost);

// Like a post
router.post('/:id/likes', controller.likePost);

module.exports = router;