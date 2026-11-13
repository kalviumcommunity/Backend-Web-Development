const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const payload = service.listPosts(req.query);
  return http.sendList(res, payload.data, payload.meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'NOT_FOUND', 'Post not found');
  }
  return http.sendOk(res, post);
}

function createPost(req, res) {
  try {
    const post = service.createPost(req.body);
    return http.sendCreated(res, post);
  } catch (err) {
    const status = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'Something went wrong';
    return http.sendError(res, status, code, message);
  }
}

function likePost(req, res) {
  try {
    const post = service.likePost(req.params.id);
    return http.sendCreated(res, post);
  } catch (err) {
    const status = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'Something went wrong';
    return http.sendError(res, status, code, message);
  }
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    return http.sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
