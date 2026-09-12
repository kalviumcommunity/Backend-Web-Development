const postsRepo = require('./../repository/postsRepo');
const votesRepo = require('./../repository/votesRepo');
const AppError = require('./../utils/AppError');

exports.castVote = async (postId, userId) => {
  // 1. Post must exist
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. User must not have already voted
  const existingVote = await votesRepo.find(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // All checks passed
  return votesRepo.insert(postId, userId);
};

exports.countFor = async (postId) => votesRepo.countByPost(postId);