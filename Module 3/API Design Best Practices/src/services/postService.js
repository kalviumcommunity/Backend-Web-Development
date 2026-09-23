const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 10;

function listPosts(query = {}) {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Math.min(Number(query.limit), MAX_LIMIT) : DEFAULT_LIMIT;
  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.max(Math.ceil(total / limit), 1);
  const startIndex = (page - 1) * limit;
  const data = allPosts.slice(startIndex, startIndex + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages
    }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';

  if (!title || !author) {
    const err = new Error('Title and author are required');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  return store.createPost({ title, author });
}

function likePost(id) {
  const post = store.incrementLikes(id);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  return post;
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  err.code = 'INTERNAL_ERROR';
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};
