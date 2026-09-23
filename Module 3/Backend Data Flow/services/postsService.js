const repo = require('../repository/postsRepo');
const AppError = require('../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) => repo.insert({ authorId, title, body });

exports.editPost = async (postId, userId, changes) => {
  // 1. Check if post exists
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check if user is the author
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Check if post is within 24-hour edit window
  const now = Date.now();
  const createdAt = new Date(post.createdAt).getTime();

  if (now - createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // All guards passed → update the post
  return repo.update(postId, changes);
};