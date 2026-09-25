const postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

/**
 * Domain rule: cast a vote, one per user per post.
 *
 * Rules:
 * 1. The post must exist.
 * 2. The user must not have already voted on the post.
 *
 * Both checks must happen before creating the vote.
 */
exports.castVote = async (postId, userId) => {
  // 1. Check whether the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check whether the user has already voted
  const existingVote = await votesRepo.find(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // All checks passed, so create the vote
  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => votesRepo.countByPost(postId);