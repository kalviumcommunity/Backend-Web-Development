
const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res, next) {
  try {
    const result = service.listPosts(req.query);
    return http.sendList(res, result);
  } catch (err) {
    next(err);
  }
}

function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);

    if (!post) {
      return http.sendError(res, 404, {
        code: 'POST_NOT_FOUND',
        message: 'Post not found',
      });
    }

    return http.sendOk(res, { post });
  } catch (err) {
    next(err);
  }
}

function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);
    return http.sendCreated(res, { post });
  } catch (err) {
    next(err);
  }
}

function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);

    if (!post) {
      return http.sendError(res, 404, {
        code: 'POST_NOT_FOUND',
        message: 'Post not found',
      });
    }

    return http.sendOk(res, {
      post: {
        id: post.id,
        likes: post.likes,
      },
    });
  } catch (err) {
    next(err);
  }
}

function demoError(req, res, next) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'Demo route completed',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  demoError,
};