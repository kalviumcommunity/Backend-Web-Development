const store = require('../data/postStore');

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  let page = Number.parseInt(query.page, 10) || 1;
  let limit = Number.parseInt(query.limit, 10) || 20;

  // Keep values safe
  page = Math.max(page, 1);
  limit = Math.min(Math.max(limit, 1), 100);

  const total = allPosts.length;
  const pages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const data = allPosts.slice(start, start + limit);

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
  return store.createPost({
    title: body.title,
    author: body.author,
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
  explode,
};