const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 100;

function toPositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function listPosts(query = {}) {
  const page = toPositiveInt(query.page, 1);
  const limit = Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);

  const all = store.getAllPosts();
  const total = all.length;
  const pages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;

  return {
    rows: all.slice(start, start + limit),
    meta: { page, limit, total, pages }
  };
}

function getPost(id) {
  return store.getPostById(id) || null;
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
  throw new Error('SQLITE_CONSTRAINT in posts table');
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};