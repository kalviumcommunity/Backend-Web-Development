const postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

/**
 * TODO (Domain rule): cast a vote, one per user per post.
 */
exports.castVote = async (postId, userId) => {
  // 1. Check if the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check if the user has already voted
  const existingVote = await votesRepo.find(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // 3. Both checks passed → create the vote
  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => votesRepo.countByPost(postId);