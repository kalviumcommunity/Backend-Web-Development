const store = require('../data/postStore');

const MAX_LIMIT = 10;

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  let page = Number.parseInt(query.page, 10);
  let limit = Number.parseInt(query.limit, 10);

  // Default values
  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = 5;
  }

  // Server-side limit cap
  limit = Math.min(limit, MAX_LIMIT);

  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const rows = allPosts.slice(start, start + limit);

  return {
    rows,
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