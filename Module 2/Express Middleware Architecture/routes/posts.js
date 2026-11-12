const express = require('express');
const router = express.Router();

// Import per-route middleware
const auditWrite = require('../middleware/auditWrite');

const posts = [{ id: 1, title: 'Hello World' }];

// GET — no auditWrite middleware
router.get('/', (req, res) => {
  res.json({ data: posts });
});

// POST — auditWrite runs only when creating a post
router.post('/', auditWrite, (req, res) => {
  const post = {
    id: posts.length + 1,
    title: req.body.title || 'Untitled'
  };

  posts.push(post);

  res.status(201).json({ data: post });
});

module.exports = router;