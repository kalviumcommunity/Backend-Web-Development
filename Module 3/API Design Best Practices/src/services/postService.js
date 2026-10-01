const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);

  const requestedLimit = Math.max(
    parseInt(query.limit, 10) || 2,
    1
  );

  const limit = Math.min(requestedLimit, 100);

  const allPosts = store.getAllPosts();

  const total = allPosts.length;

  const pages = Math.ceil(total / limit);

  const startIndex = (page - 1) * limit;

  const rows = allPosts.slice(
    startIndex,
    startIndex + limit
  );

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
    const err = new Error(
      'POSTS_TABLE missing row while incrementing likes'
    );

    err.statusCode = 500;
    err.debug = 'FakeStack: at postService.js:19:11';

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