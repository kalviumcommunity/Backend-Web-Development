const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

exports.addComment = async (postId, userId, body) => {
  // 1. Check if post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check if post is locked
  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  // 3. Insert comment
  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body
  });

  // 4. Increment comment count
  await postsRepo.incrementCommentCount(postId);

  // 5. Return created comment
  return comment;
};