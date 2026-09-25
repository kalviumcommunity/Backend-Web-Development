const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  try {
    const result = service.listPosts(req.query);
    return http.sendList(res, result.data, result.meta);
  } catch (err) {
    return handleError(res, err);
  }
}

function getPost(req, res) {
  try {
    const post = service.getPost(req.params.id);
    if (!post) {
      return http.sendError(res, 404, 'NOT_FOUND', 'Post not found');
    }
    return http.sendOk(res, post);
  } catch (err) {
    return handleError(res, err);
  }
}

function createPost(req, res) {
  try {
    const post = service.createPost(req.body);
    return http.sendCreated(res, post);
  } catch (err) {
    return handleError(res, err);
  }
}

function likePost(req, res) {
  try {
    const post = service.likePost(req.params.id);
    return http.sendOk(res, post);
  } catch (err) {
    return handleError(res, err);
  }
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    return http.sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
  }
}

function handleError(res, err) {
  const statusCode = err.statusCode || 500;
  if (statusCode === 400) {
    return http.sendError(res, 400, err.code || 'VALIDATION_ERROR', err.message || 'Invalid input', err.details);
  }
  if (statusCode === 404) {
    return http.sendError(res, 404, err.code || 'NOT_FOUND', err.message || 'Post not found');
  }
  return http.sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};

