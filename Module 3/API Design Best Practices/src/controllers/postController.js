const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);

  return http.sendList(res, result.posts, result.meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);

  if (!post) {
    return http.sendError(
      res,
      404,
      'POST_NOT_FOUND',
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

    return http.sendOk(res, post);
  } catch (err) {
    if (err.statusCode === 404) {
      return http.sendError(
        res,
        404,
        'POST_NOT_FOUND',
        'Post not found'
      );
    }

    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'An internal server error occurred'
    );
  }
}

function explode(req, res) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'No failure occurred'
    });
  } catch (err) {
    console.error(err);

    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'An internal server error occurred'
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