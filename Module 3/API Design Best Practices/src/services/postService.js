const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const requestedLimit = Math.max(parseInt(query.limit) || 10, 1);
  const limit = Math.min(requestedLimit, 100);

  const posts = store.getAllPosts();

  const total = posts.length;
  const pages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const data = posts.slice(start, start + limit);

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
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  const post = store.incrementLikes(id);

  if (!post) {
    return null;
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