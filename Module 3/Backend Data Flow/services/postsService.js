const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

/**
 * TODO (Domain rule): edit a post.
 */
exports.editPost = async (postId, userId, changes) => {
  // 1. Check if the post exists
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check if the user is the author
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Check if the post is within the 24-hour edit window
  if (Date.now() - post.createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // 4. All checks passed → update the post
  return repo.update(postId, changes);
};