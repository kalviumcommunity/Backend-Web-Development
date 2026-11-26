onst postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

/**
 * Cast a vote, one per user per post.
 */
exports.castVote = async (postId, userId) => {
  // 1. The post must exist
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. The user must not have already voted
  const existingVote = await votesRepo.findByPostAndUser(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // 3. Insert the vote only after both checks pass
  return votesRepo.insert(postId, userId);
};