const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 100;

function invalidPagination(name) {
  const err = new Error(`Invalid ${name}`);
  err.statusCode = 400;
  err.publicCode = 'INVALID_PAGINATION';
  err.publicMessage = `${name} must be a positive integer`;
  return err;
}

function parsePositiveInteger(value, fallback, name) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    throw invalidPagination(name);
  }
  return Number(value);
}

function listPosts(query = {}) {
  const page = parsePositiveInteger(query.page, 1, 'page');
  if (!Number.isSafeInteger(page)) throw invalidPagination('page');
  const requestedLimit = parsePositiveInteger(query.limit, DEFAULT_LIMIT, 'limit');
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    posts: allPosts.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
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
  throw new Error('Simulated internal failure');
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
