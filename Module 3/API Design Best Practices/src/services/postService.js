
const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 50;

function listPosts(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);

  const requestedLimit = parseInt(query.limit, 10);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, requestedLimit || DEFAULT_LIMIT)
  );

  const allPosts = store.getAllPosts();

  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const posts = allPosts.slice(startIndex, startIndex + limit);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author,
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
  const err = new Error('Internal demo failure');
  err.statusCode = 500;
  err.code = 'INTERNAL_ERROR';
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};