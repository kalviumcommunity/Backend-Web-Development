
const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

// GET /posts
router.get('/', controller.listPosts);

// GET /posts/:id
router.get('/:id', controller.getPost);

// POST /posts
router.post('/', controller.createPost);

// POST /posts/:id/likes
router.post('/:id/likes', controller.likePost);

module.exports = router;

