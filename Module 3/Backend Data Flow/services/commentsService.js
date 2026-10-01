const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

/**
 * Multi-step workflow: add a comment to a post.
 *
 * Rules:
 * 1. The post must exist.
 * 2. The post must not be locked.
 * 3. Insert the comment.
 * 4. Increment the post's comment count.
 * 5. Return the created comment.
 *
 * All checks happen before any write.
 */
exports.addComment = async (postId, userId, body) => {
  // 1. Check whether the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check whether the post is locked
  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  // 3. Create the comment
  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body
  });

  // 4. Increment the post's comment count
  await postsRepo.incrementCommentCount(postId);

  // 5. Return the created comment
  return comment;
};