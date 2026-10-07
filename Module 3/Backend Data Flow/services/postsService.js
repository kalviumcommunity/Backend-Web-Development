const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

// Get all posts
exports.getAll = async () => repo.findAll();

// Create post
exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

// Edit post
exports.editPost = async (postId, userId, changes) => {
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  const ageMs = Date.now() - post.createdAt;

  if (ageMs > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  return repo.update(postId, changes);
};