const service = require('../services/postService');
const http = require('../utils/http');


function listPosts(req, res) {
  const result = service.listPosts(req.query);

  const meta = {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: Math.ceil(result.total / result.limit)
  };

  return http.sendList(res, result.data, meta);
}


function getPost(req, res) {
  const post = service.getPost(req.params.id);
  if (!post) {
    return http.sendError(res, 404, { message: 'post missing' });
  }
  return http.sendOk(res, post);
}

function createPost(req, res) {
  const post = service.createPost(req.body);
  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);
  return http.sendOk(res, { ok: true, likes: post.likes });

}




//function explode(req, res) {
  //try {
    //service.explode();
  //} catch (err) {
    //return http.sendError(res, 500, { error: err.message, stack: err.debug || err.stack });
  //}
//}

function explode(req, res, next) {
  try {
    service.explode();

    return http.sendOk(res, {
      message: 'Test completed'
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
  explode
};