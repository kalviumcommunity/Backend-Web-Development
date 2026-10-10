const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);
  return http.sendList(res, result.posts, result.meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'POST_NOT_FOUND', 'Post not found');
  }
  return http.sendOk(res, post);
}

function createPost(req, res) {
  if (!req.body || typeof req.body.title !== 'string' || !req.body.title.trim()
      || typeof req.body.author !== 'string' || !req.body.author.trim()) {
    return http.sendError(res, 400, 'VALIDATION_ERROR', 'Title and author are required');
  }
  const post = service.createPost(req.body);
  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, 'POST_NOT_FOUND', 'Post not found');
  }
  return http.sendOk(res, post);
}

function explode() {
  service.explode();
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
