const store = require('../data/postStore');

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  // Get page and limit from query parameters
  const page = Math.max(1, parseInt(query.page, 10) || 1);

  // Never allow more than 100 posts per page
  const limit = Math.min(
    100,
    Math.max(1, parseInt(query.limit, 10) || 10)
  );

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
  const err = new Error('Internal server error');
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