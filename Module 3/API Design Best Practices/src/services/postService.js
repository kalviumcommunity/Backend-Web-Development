const store = require('../data/postStore');

function listPosts(query = {}) {
  const rawLimit = Number.parseInt(query.limit, 10);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 10)) : 2;

  const data = store.getAllPosts();
  const total = data.length;
  const page = data.slice(0, limit);

  return {
    data: page,
    meta: {
      limit,
      total,
      nextCursor: total > limit ? data[limit]?.id ?? null : null,
      hasMore: total > limit
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
    const err = new Error('POSTS_TABLE missing row while incrementing likes');
    err.statusCode = 500;
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
