const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const { rows, meta } = service.listPosts(req.query);
  return http.sendList(res, rows, meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendNotFound(res, 'Post not found');
  }
  return http.sendOk(res, post);
}

function createPost(req, res) {
  if (!req.body || !req.body.title) {
    return http.sendBadRequest(res, 'Title is required');
  }
  const post = service.createPost(req.body);
  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);
  if (!post) {
    return http.sendNotFound(res, 'Post not found');
  }
  return http.sendCreated(res, post);
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    console.error('Safe internal error logged:', err.message, err.stack);
    return http.sendInternalError(res, 'Something went wrong');
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
