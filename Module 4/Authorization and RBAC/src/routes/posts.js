
const express = require('express');
const { posts } = require('../data');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// List posts — any authenticated user.
router.get('/', (req, res) => {
  return res.status(200).json(posts);
});

// Create a post — the caller becomes the author.
router.post('/', (req, res) => {
  const post = {
    id: String(posts.length + 1),
    authorId: req.user.id,
    title: req.body?.title ?? 'Untitled',
    hidden: false,
  };

  posts.push(post);

  return res.status(201).json(post);
});

// Update a post — owner OR moderator/admin.
router.patch('/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  // First check whether the post exists.
  if (!post) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Post not found',
      },
    });
  }

  // Check ownership or privileged role.
  const isOwner = post.authorId === req.user.id;

  const isPrivileged =
    req.user.role === 'moderator' ||
    req.user.role === 'admin';

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You cannot modify another user\'s post',
      },
    });
  }

  post.title = req.body?.title ?? post.title;

  return res.status(200).json(post);
});

// Delete a post — owner OR moderator/admin.
router.delete('/:id', (req, res) => {
  const idx = posts.findIndex((p) => p.id === req.params.id);

  // First check whether the post exists.
  if (idx === -1) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Post not found',
      },
    });
  }

  const post = posts[idx];

  // Check ownership or privileged role.
  const isOwner = post.authorId === req.user.id;

  const isPrivileged =
    req.user.role === 'moderator' ||
    req.user.role === 'admin';

  if (!isOwner && !isPrivileged) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You cannot delete another user\'s post',
      },
    });
  }

  posts.splice(idx, 1);

  return res.status(200).json({ ok: true });
});

// Hide a post — moderator/admin only.
router.post(
  '/:id/hide',
  requireRole('moderator', 'admin'),
  (req, res) => {
    const post = posts.find((p) => p.id === req.params.id);

    if (!post) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Post not found',
        },
      });
    }

    post.hidden = true;

    return res.status(200).json(post);
  }
);

module.exports = router;
