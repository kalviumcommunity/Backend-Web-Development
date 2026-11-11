const voteRepository = require('../repositories/voteRepository');

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

async function castVote(userId, postId) {
  const existing = voteRepository.findByUserAndPost(userId, postId);
  if (existing) throw new AppError('ALREADY_VOTED', 409);
  return voteRepository.create({ userId, postId });
}

module.exports = { castVote, AppError };
