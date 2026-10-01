const store = require('../data/postStore');

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 5;

function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  const requestedLimit = Number.parseInt(query.limit, 10);

  let limit = DEFAULT_LIMIT;

  if (Number.isInteger(requestedLimit) && requestedLimit > 0) {
    limit = Math.min(requestedLimit, MAX_LIMIT);
  }

  const posts = allPosts.slice(0, limit);

  return {
    posts,
    meta: {
      total: allPosts.length,
      limit,
      returned: posts.length,
      hasMore: posts.length < allPosts.length
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
    err.code = 'POST_NOT_FOUND';
    throw err;
  }

  return post;
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