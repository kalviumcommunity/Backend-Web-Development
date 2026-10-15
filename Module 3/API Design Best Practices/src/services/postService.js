const store = require('../data/postStore');

function listPosts(query = {}) {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, 100)
    : 2;

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    data: allPosts.slice(start, start + limit),
    meta: { page, limit, total, pages }
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  if (
    typeof body.title !== 'string' || !body.title.trim() ||
    typeof body.author !== 'string' || !body.author.trim()
  ) {
    const err = new Error('Title and author are required');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  return store.createPost({
    title: body.title.trim(),
    author: body.author.trim()
  });
}

function likePost(id) {
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('Simulated internal failure');
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
