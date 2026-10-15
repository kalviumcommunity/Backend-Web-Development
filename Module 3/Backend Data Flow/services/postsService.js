exports.editPost = async (postId, userId, changes) => {
  // 1. Check whether the post exists
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check whether the user is the author
  if (post.authorId !== userId) {
    throw new AppError('You can only edit your own post', 403);
  }

  // 3. Check whether the post is within the 24-hour edit window
  const now = Date.now();
  const createdAt = new Date(post.createdAt).getTime();

  if (now - createdAt > EDIT_WINDOW_MS) {
    throw new AppError('Post can no longer be edited', 403);
  }

  // 4. All checks passed — update the post
  return repo.update(postId, changes);
};