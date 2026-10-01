const store = require("../data/postStore");

const DEFAULT_LIMIT = 2;
const MAX_LIMIT = 10;

function listPosts(query = {}) {
  const requestedLimit = Number.parseInt(query.limit, 10);
  const requestedPage = Number.parseInt(query.page, 10);

  const limit = Math.min(
    Math.max(requestedLimit || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );

  const page = Math.max(requestedPage || 1, 1);

  const allPosts = store.getAllPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    posts: allPosts.slice(start, start + limit),
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
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
  throw new Error("Internal failure");
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};