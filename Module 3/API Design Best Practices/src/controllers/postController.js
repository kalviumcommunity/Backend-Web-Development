const service = require("../services/postService");
const http = require("../utils/http");

function listPosts(req, res) {
  const result = service.listPosts(req.query);

  return http.sendList(res, result.posts, result.meta);
}

function getPost(req, res) {
  const post = service.getPost(req.params.id);

  if (!post) {
    return http.sendError(
      res,
      404,
      "POST_NOT_FOUND",
      "Post not found"
    );
  }

  return http.sendOk(res, post);
}

function createPost(req, res) {
  const { title, author } = req.body || {};

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof author !== "string" ||
    !author.trim()
  ) {
    return http.sendError(
      res,
      400,
      "INVALID_POST",
      "Title and author are required"
    );
  }

  const post = service.createPost({
    title: title.trim(),
    author: author.trim(),
  });

  return http.sendCreated(res, post);
}

function likePost(req, res) {
  const post = service.likePost(req.params.id);

  if (!post) {
    return http.sendError(
      res,
      404,
      "POST_NOT_FOUND",
      "Post not found"
    );
  }

  return http.sendOk(res, post);
}

function explode(req, res) {
  try {
    service.explode();
  } catch (err) {
    console.error("Internal test failure:", err.message);

    return http.sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "An unexpected error occurred"
    );
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};