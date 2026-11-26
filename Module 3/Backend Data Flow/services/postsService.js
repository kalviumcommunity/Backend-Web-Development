const store = require('../data/postStore');


function listPosts(query = {}) {
  const allPosts = store.getAllPosts();

  const requestedPage = parseInt(query.page, 10) || 1;
  const page = Math.max(requestedPage, 1);

  const requestedLimit = parseInt(query.limit, 10) || 2;
  const limit = Math.min(Math.max(requestedLimit, 1), 2);

  const startIndex = (page - 1) * limit;
  const data = allPosts.slice(startIndex, startIndex + limit);

  return {
    data,
    total: allPosts.length,
    page,
    limit
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
    const err = new Error('POSTS_TABLE missing row while incrementing likes');
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