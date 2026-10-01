const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res, next) {
  try {
    const result = service.listPosts(req.query);

    return http.sendList(res, result.posts, result.meta);
  } catch (err) {
    return next(err);
  }
}

function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);

    if (!post) {
      return http.sendError(res, 404, {
        code: 'POST_NOT_FOUND',
        message: 'Post not found'
      });
    }

    return http.sendOk(res, post);
  } catch (err) {
    return next(err);
  }
}

function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);

    return http.sendCreated(res, post);
  } catch (err) {
    return next(err);
  }
}

function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);

    return http.sendOk(res, {
      id: post.id,
      likes: post.likes
    });
  } catch (err) {
    return next(err);
  }
}

function explode(req, res, next) {
  try {
    service.explode();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};