
const store = require('../data/postStore');

function listPosts(query = {}) {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0
    ? parsedPage
    : 1;

  const requestedLimit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? parsedLimit
      : 2;

  // Never allow a client to request more than 100 posts per page.
  const limit = Math.min(requestedLimit, 100);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data = allPosts.slice(startIndex, startIndex + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages,
    },
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  const title =
    typeof body.title === 'string' ? body.title.trim() : '';

  const author =
    typeof body.author === 'string' ? body.author.trim() : '';

  if (!title || !author) {
    const err = new Error('Title and author are required');
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  return store.createPost({ title, author });
}

function likePost(id) {
  // A missing post is not an internal server error.
  return store.incrementLikes(id);
}

function explode() {
  // Deliberately simulate an internal failure for testing.
  const err = new Error('Simulated internal failure');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};

