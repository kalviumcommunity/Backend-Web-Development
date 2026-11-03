const service = require('../services/postService');
const http = require('../utils/http');

function listPosts(req, res) {
  const result = service.listPosts(req.query);

  return res.status(200).json({
    data: result.data,
    meta: result.meta
  });
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);

  if (!post) {
    return http.sendError(res, 404, {
      code: 'NOT_FOUND',
      message: 'Post not found'
    });
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

    if (!post) {
      return http.sendError(res, 404, {
        code: 'NOT_FOUND',
        message: 'Post not found'
      });
    }

    return http.sendCreated(res, {
      postId: post.id,
      likes: post.likes
    });
  } catch (err) {
    console.error(err);

    return http.sendError(res, 500, {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    });
  }
} 

function explode(req, res) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'Success'
    });
  } catch (err) {
    console.error(err);

    return http.sendError(res, 500, {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong'
    });
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};