const repo = require('./../repository/postsRepo');

const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();

exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

/**
 * Edit a post.
 * Check all rules before updating.
 */
exports.editPost = async (postId, userId, changes) => {
  // 1. Check whether the post exists
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check whether the user owns the post
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Check whether the post is within the 24-hour window
  if (Date.now() - post.createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // 4. Update the post only if all checks pass
  return repo.update(postId, changes);
};