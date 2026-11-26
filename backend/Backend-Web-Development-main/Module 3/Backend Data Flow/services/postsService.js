const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();

exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

exports.editPost = async (postId, userId, changes) => {
  // 1. The post must exist
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Only the author may edit the post
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. The post must be within the 24-hour edit window
  const now = Date.now();
  const createdAt = new Date(post.createdAt).getTime();

  if (now - createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // 4. Update only after all guards pass
  return repo.update(postId, changes);
};