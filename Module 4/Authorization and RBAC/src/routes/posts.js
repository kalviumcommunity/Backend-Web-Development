
const express = require('express');
const { posts } = require('../data');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

const PRIVILEGED = ['moderator', 'admin'];

// Check post ownership or privileged role
function loadOwnedOrPrivileged(req, res) {
  const post = posts.find((p) => p.id === req.params.id);

  // Check whether post exists
  if (!post) {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Post not found'
      }
    });
    return null;
  }

  const isOwner = post.authorId === req.user.id;
  const isPrivileged = PRIVILEGED.includes(req.user.role);

  // Check ownership
  if (!isOwner && !isPrivileged) {
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not own this resource'
      }
    });
    return null;
  }

  return post;
}

// GET all posts
router.get('/', (req, res) => {
  return res.status(200).json(posts);
});

// CREATE a post
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

// UPDATE a post - owner or moderator/admin
router.patch('/:id', (req, res) => {
  const post = loadOwnedOrPrivileged(req, res);

  if (!post) return;

  post.title = req.body?.title ?? post.title;

  return res.status(200).json(post);
});

// DELETE a post - owner or moderator/admin
router.delete('/:id', (req, res) => {
  const post = loadOwnedOrPrivileged(req, res);

  if (!post) return;

  posts.splice(posts.indexOf(post), 1);

  return res.status(200).json({ ok: true });
});

// HIDE a post - moderator/admin only
router.post(
  '/:id/hide',
  requireRole('moderator', 'admin'),
  (req, res) => {
    const post = posts.find((p) => p.id === req.params.id);

    if (!post) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Post not found'
        }
      });
    }

    post.hidden = true;

    return res.status(200).json(post);
  }
);

module.exports = router;
