

const postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

/**
 * Domain rule: cast a vote, one per user per post.
 * Guards before writing:
 *   1. Post must exist
 *   2. User must not have voted already
 * Only when both pass: insert vote.
 */
exports.castVote = async (postId, userId) => {
  // 1. The post must exist
  const post = await postsRepo.findById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. The user must not have voted already
  const existingVote = await votesRepo.find(postId, userId);
  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // All guards passed → insert vote
  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => votesRepo.countByPost(postId);
