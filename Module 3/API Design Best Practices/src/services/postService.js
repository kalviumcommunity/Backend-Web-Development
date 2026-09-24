const store = require('../data/postStore');

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  const requestedLimit = Number.parseInt(query.limit, 10);
  const limit = Number.isNaN(requestedLimit)
    ? 2
    : Math.min(Math.max(requestedLimit, 1), 5);

  const page = allPosts.slice(0, limit);

  return {
    rows: page,
    total: allPosts.length,
    limit,
    hasMore: page.length < allPosts.length
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
    err.code = 'NOT_FOUND';
    throw err;
  }

  return post;
}

function explode() {
  const err = new Error('Internal failure');
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