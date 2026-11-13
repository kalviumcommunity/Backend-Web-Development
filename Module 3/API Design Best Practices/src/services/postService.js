const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 5;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function listPosts(query = {}) {
  const page = parsePositiveInt(query.page, 1);
  const requestedLimit = parsePositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const start = (page - 1) * limit;
  const data = allPosts.slice(start, start + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages
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
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
