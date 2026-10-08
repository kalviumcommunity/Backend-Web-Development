/*const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) => repo.insert({ authorId, title, body });
*/
/**
 * TODO (Domain rule): edit a post.
 * Implement these guards IN ORDER, each throwing an AppError, before any write:
 *   1. The post must exist          -> AppError('Post not found', 404)
 *   2. Only the author may edit it  -> AppError('You can only edit your own post', 403)
 *   3. It must be within the window  -> AppError('Post can no longer be edited', 403)
 *      (now - post.createdAt must be <= EDIT_WINDOW_MS)
 * Only when all guards pass: return repo.update(postId, changes).
 */
/*exports.editPost = async (postId, userId, changes) => {
  throw new AppError('editPost is not implemented yet', 501);
}; */
const repo = require('./../repository/postsRepo');
const AppError = require('./../utils/AppError');

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

/**
 * Domain rule: edit a post.
 * Guards in order:
 *   1. Post must exist
 *   2. Only the author may edit
 *   3. Must be within 24h window
 * Only when all guards pass: update and return.
 */
exports.editPost = async (postId, userId, changes) => {
  // 1. The post must exist
  const post = repo.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Only the author may edit
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Must be within the 24h window
  const ageMs = Date.now() - post.createdAt.getTime();
  if (ageMs > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // All guards passed → perform update
  return repo.update(postId, changes);
};

