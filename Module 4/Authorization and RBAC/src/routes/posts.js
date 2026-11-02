/*const express = require('express');
const { posts } = require('../data');
// const requireRole = require('../middleware/requireRole'); // TODO: use for the hide route

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

// Update a post.
// BUG: any authenticated user can edit ANY post — this is the IDOR.
// TODO: allow only the owner OR a moderator/admin. Return 404 if the post is missing.
router.patch('/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  post.title = req.body?.title ?? post.title;
  return res.status(200).json(post);
});

// Delete a post.
// BUG: same IDOR — any authenticated user can delete ANY post.
// TODO: allow only the owner OR a moderator/admin. Return 404 if the post is missing.
router.delete('/:id', (req, res) => {
  const idx = posts.findIndex((p) => p.id === req.params.id);
  posts.splice(idx, 1);
  return res.status(200).json({ ok: true });
});

// Hide a post — should be moderator/admin only.
// TODO: gate with requireRole('moderator', 'admin').
router.post('/:id/hide', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post not found' } });
  post.hidden = true;
  return res.status(200).json(post);
});

module.exports = router;*/
const express = require('express');
const { posts } = require('../data');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

const canManagePost = (user, post) =>
  post.authorId === user.id || ['moderator', 'admin'].includes(user.role);

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

// Update a post — only the owner, a moderator, or an admin.
router.patch('/:id', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' },
    });
  }

  if (!canManagePost(req.user, post)) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this post' },
    });
  }

  post.title = req.body?.title ?? post.title;
  return res.status(200).json(post);
});

// Delete a post — only the owner, a moderator, or an admin.
router.delete('/:id', (req, res) => {
  const idx = posts.findIndex((p) => p.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' },
    });
  }

  const post = posts[idx];

  if (!canManagePost(req.user, post)) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this post' },
    });
  }

  posts.splice(idx, 1);
  return res.status(200).json({ ok: true });
});

// Hide a post — moderator/admin only.
router.post('/:id/hide', requireRole('moderator', 'admin'), (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Post not found' },
    });
  }

  post.hidden = true;
  return res.status(200).json(post);
});

module.exports = router;
