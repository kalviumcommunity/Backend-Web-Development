const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const { rows, meta } = service.listPosts(req.query);
  return http.sendList(res, rows, meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'NOT_FOUND', 'Post not found');
  }
  return http.sendData(res, post);
}

function createPost(req, res) {
  const body = req.body || {};
  if (typeof body.title !== 'string' || body.title.trim() === '') {
    return http.sendError(res, 400, 'VALIDATION_ERROR', 'title is required');
  }
  const post = service.createPost(body);
  return http.sendData(res, post, 201);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'NOT_FOUND', 'Post not found');
  }
  return http.sendData(res, post, 201);
}

function explode(req, res) {
  service.explode();
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
