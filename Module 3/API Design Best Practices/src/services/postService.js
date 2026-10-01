const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 2, 1), 100);
  const allPosts = store.getAllPosts();
  const start = (page - 1) * limit;

  return {
    rows: allPosts.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: allPosts.length,
      pages: Math.ceil(allPosts.length / limit)
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
