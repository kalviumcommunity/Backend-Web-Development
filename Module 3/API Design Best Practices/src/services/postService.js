const store = require('../data/postStore');

function listPosts(query = {}) {
  const requestedPage = Number(query.page) || 1;
  const requestedLimit = Number(query.limit) || 2;

  const page = Math.max(requestedPage, 1);
  const limit = Math.min(Math.max(requestedLimit, 1), 100);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const pages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const rows = allPosts.slice(start, start + limit);

  return {
    rows,
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