const store = require('../data/postStore');

function listPosts(query = {}) {
  let page = parseInt(query.page, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = 20;
  }
  limit = Math.min(limit, 100);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = total === 0 ? 0 : Math.ceil(total / limit);

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
  const { title, author } = body;
  const details = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    details.push('Title is required and must be a non-empty string');
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    details.push('Author is required and must be a non-empty string');
  }

  if (details.length > 0) {
    const err = new Error('Invalid input');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    err.details = details;
    throw err;
  }

  return store.createPost({
    title: title.trim(),
    author: author.trim()
  });
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
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};

