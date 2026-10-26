const bcrypt = require('bcryptjs');
const userRepository = require('../db/prisma');

const INVALID_CREDENTIALS = {
  error: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
};

const DUMMY_PASSWORD_HASH =
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOqVv9R0nM3g4n1xQhZqQf0m4h8x3xK5W';

class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function requireFields(input, fields) {
  if (
    !input ||
    fields.some(
      (field) => typeof input[field] !== 'string' || input[field].trim().length === 0,
    )
  ) {
    throw new AppError(400, 'INVALID_INPUT', 'Required fields must be non-empty strings');
  }
}

async function register(input) {
  requireFields(input, ['name', 'email', 'password']);

  const email = normalizeEmail(input.email);
  const name = input.name.trim();

  try {
    const user = await userRepository.createUser({
      name,
      email,
      passwordHash: await bcrypt.hash(input.password, Number(process.env.BCRYPT_COST || 12)),
    });

    return safeUser(user);
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists');
    }
    throw error;
  }
}

async function login(input) {
  requireFields(input, ['email', 'password']);

  const user = await userRepository.findUserByEmail(normalizeEmail(input.email));
  const passwordHash = user ? user.passwordHash : DUMMY_PASSWORD_HASH;
  const valid = await bcrypt.compare(input.password, passwordHash);

  if (!user || !valid) {
    throw new AppError(401, INVALID_CREDENTIALS.error.code, INVALID_CREDENTIALS.error.message);
  }

  return safeUser(user);
}

module.exports = {
  AppError,
  INVALID_CREDENTIALS,
  register,
  login,
};
