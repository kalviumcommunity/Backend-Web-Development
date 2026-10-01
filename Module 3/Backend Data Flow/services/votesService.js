exports.castVote = async (postId, userId) => {
  // 1. Check whether the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check whether the user has already voted
  const existingVote = await votesRepo.findByPostAndUser(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // Both guards passed — record the vote
  return votesRepo.insert(postId, userId);
};