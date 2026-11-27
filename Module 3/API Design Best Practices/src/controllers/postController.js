
const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res, next) {
  try {
    const result = service.listPosts(req.query);
    return http.sendList(res, result.data, result.meta);
  } catch (err) {
    return next(err);
  }
}

function getPost(req, res, next) {
  try {
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

    if (!post) {
      return http.sendError(
        res,
        404,
        'NOT_FOUND',
        'Post not found'
      );
    }

    return http.sendCreated(res, {
      postId: post.id,
      likes: post.likes,
    });
  } catch (err) {
    return next(err);
  }
}

function explode(req, res, next) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'No failure occurred',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};

