const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);

  const requestedLimit = Number.parseInt(query.limit, 10) || 2;
  const limit = Math.min(Math.max(requestedLimit, 1), 2);

  const allPosts = store.getAllPosts();

  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const data = allPosts.slice(start, start + limit);

  return {
    data,
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
  const err = new Error('Internal database failure');
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
