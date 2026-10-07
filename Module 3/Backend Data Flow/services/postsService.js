const postsRepo = require("../repository/postsRepo");
const AppError = require("../utils/AppError");

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

exports.editPost = async (postId, userId, changes) => {
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.authorId !== userId) {
    throw new AppError("You can only edit your own post", 403);
  }

  if (Date.now() - post.createdAt > EDIT_WINDOW_MS) {
    throw new AppError("Post can no longer be edited", 403);
  }

  return postsRepo.update(postId, changes);
};