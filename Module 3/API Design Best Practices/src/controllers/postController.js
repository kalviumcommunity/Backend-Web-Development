const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);

  return http.sendList(
    res,
    result.rows,
    result.meta
  );
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

    return http.sendCreated(res, {
      id: post.id,
      likes: post.likes
    });
  } catch (err) {
    console.error(err);

    return http.sendError(
      res,
      500,
      'INTERNAL_ERROR',
      'Something went wrong'
    );
  }
}

function explode(req, res) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'No failure'
    });
  } catch (err) {
    console.error(err);

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