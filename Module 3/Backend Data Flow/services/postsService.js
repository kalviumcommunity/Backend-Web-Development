exports.editPost = async (postId, userId, changes) => {
  const post = await repo.findById(postId);

  // 1. Post must exist
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Only the author may edit
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Post must be within the 24-hour edit window
  const now = Date.now();
  const createdAt = new Date(post.createdAt).getTime();

  if (now - createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // All guards passed — perform the update
  return repo.update(postId, changes);
};