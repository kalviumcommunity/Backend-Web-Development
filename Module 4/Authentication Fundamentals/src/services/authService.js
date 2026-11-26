const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const COST_FACTOR = Number(process.env.BCRYPT_COST || 12);

function invalidCredentials() {
  const error = new Error('Invalid email or password');
  error.status = 401;
  error.code = 'INVALID_CREDENTIALS';
  return error;
}

async function register({ name, email, password }) {
  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof password !== 'string' || !password.trim()
  ) {
    const error = new Error('Name, email and password are required');
    error.status = 400;
    error.code = 'INVALID_INPUT';
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.status = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, COST_FACTOR);

  const user = await userRepository.createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function login({ email, password }) {
  if (
    typeof email !== 'string' || !email.trim() ||
    typeof password !== 'string' || !password.trim()
  ) {
    const error = new Error('Email and password are required');
    error.status = 400;
    error.code = 'INVALID_INPUT';
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throw invalidCredentials();
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw invalidCredentials();
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

module.exports = { register, login };