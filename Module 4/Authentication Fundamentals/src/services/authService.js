const bcrypt = require('bcryptjs');
const userRepository = require('../repository/userRepository');

const BCRYPT_COST = Number(process.env.BCRYPT_COST || 12);

class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function registerUser({ name, email, password }) {
  // Validate all three fields are non-empty strings.
  if (typeof name !== 'string' || name.trim() === '') {
    throw new AppError(400, 'VALIDATION_ERROR', 'name is required');
  }
  if (typeof email !== 'string' || email.trim() === '') {
    throw new AppError(400, 'VALIDATION_ERROR', 'email is required');
  }
  if (typeof password !== 'string' || password === '') {
    throw new AppError(400, 'VALIDATION_ERROR', 'password is required');
  }

  // Normalize email: lowercase and trimmed.
  const normalizedEmail = email.trim().toLowerCase();

  // Reject duplicate email (409 Conflict).
  const existing = await userRepository.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AppError(409, 'EMAIL_IN_USE', 'Email already registered');
  }

  // Asynchronous bcrypt hash — never store the raw password.
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const user = await userRepository.createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  // Return only safe fields — no password or hash.
  return { id: user.id, name: user.name, email: user.email };
}

async function loginUser({ email, password }) {
  // Same generic 401 for unknown email and incorrect password.
  const fail = () => new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  if (typeof email !== 'string' || typeof password !== 'string' || email.trim() === '' || password === '') {
    throw fail();
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await userRepository.findUserByEmail(normalizedEmail);
  if (!user) {
    throw fail();
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw fail();
  }

  return { id: user.id, name: user.name, email: user.email };
}

module.exports = { registerUser, loginUser, AppError };
