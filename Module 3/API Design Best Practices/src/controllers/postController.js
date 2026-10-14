
const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);
  return http.sendList(res, result.data, result.meta);
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
  const body = req.body || {};

  if (
    typeof body.title !== 'string' ||
    !body.title.trim() ||
    typeof body.author !== 'string' ||
    !body.author.trim()
  ) {
    return http.sendError(
      res,
      400,
      'INVALID_INPUT',
      'Title and author are required'
    );
  }

  const post = service.createPost({
    title: body.title.trim(),
    author: body.author.trim()
  });

  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);

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

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    // Keep internal details out of the public response.
    console.error('Internal failure:', err.message);

    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'Something went wrong'
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
