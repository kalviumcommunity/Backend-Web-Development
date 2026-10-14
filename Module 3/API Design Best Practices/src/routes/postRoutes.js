
const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

// Get all posts
router.get('/posts', controller.listPosts);

// Get one post by ID
router.get('/posts/:id', controller.getPost);

// Create a new post
router.post('/posts', controller.createPost);

// Like a post
router.post('/posts/:id/likes', controller.likePost);

module.exports = router;
