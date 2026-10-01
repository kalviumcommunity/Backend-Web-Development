const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);

  const requestedLimit =
    Number.parseInt(query.limit, 10) || 2;

  const MAX_LIMIT = 50;

  const limit = Math.min(
    Math.max(requestedLimit, 1),
    MAX_LIMIT
  );

  const posts = store.getAllPosts();

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    posts: posts.slice(start, end),
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  const post = store.incrementLikes(id);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  return post;
}

function explode() {
  const err = new Error('Internal server error');
  err.statusCode = 500;
  err.code = 'INTERNAL_SERVER_ERROR';
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};