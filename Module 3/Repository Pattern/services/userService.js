const userRepository = require('../repositories/userRepository');

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

async function signup(fields) {
  const existing = userRepository.findByUsername(fields.username);
  if (existing) throw new AppError('USERNAME_TAKEN', 409);
  return userRepository.create(fields);
}

module.exports = { signup, AppError };
