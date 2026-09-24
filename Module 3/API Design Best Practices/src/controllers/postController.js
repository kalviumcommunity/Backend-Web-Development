const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);

  return http.sendList(res, result.rows, {
    total: result.total,
    limit: result.limit,
    hasMore: result.hasMore
  });
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);

  if (!post) {
    return http.sendError(
      res,
      404,
      'NOT_FOUND',
      'Post not found'
    );
  }

  return http.sendOk(res, post);
}

function createPost(req, res) {
  const post = service.createPost(req.body);

  return http.sendCreated(res, post);
}

function likePost(req, res) {
  try {
    const post = service.likePost(req.params.id);

    return http.sendOk(res, {
      likes: post.likes
    });
  } catch (err) {
    if (err.statusCode === 404) {
      return http.sendError(
        res,
        404,
        'NOT_FOUND',
        'Post not found'
      );
    }

    throw err;
  }
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'Internal server error'
    );
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};