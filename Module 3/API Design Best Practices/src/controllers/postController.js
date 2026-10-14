const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 2));

  const rows = service.listPosts({ ...req.query, page, limit });
  return http.sendList(res, rows, { page, limit });
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);

  if (!post) {
    return http.sendError(res, 404, {
      code: 'POST_NOT_FOUND',
      message: 'Post not found'
    });
  }

  return http.sendOk(res, post);
}

function createPost(req, res) {
  const post = service.createPost(req.body);
  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);

  if (!post) {
    return http.sendError(res, 404, {
      code: 'POST_NOT_FOUND',
      message: 'Post not found'
    });
  }

  return http.sendOk(res, { likes: post.likes });
}

function explode(req, res, next) {
  try {
    service.explode();
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal error occurred'
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal error occurred'
      }
    });
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};