const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

const SALT_ROUNDS = 12;

function createAuthError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isPublicAuthError = true;
  return error;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateFields(body, fields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)
    || fields.some((field) => !isNonEmptyString(body[field]))) {
    throw createAuthError(400, 'INVALID_INPUT', 'Required fields must be non-empty strings');
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function register(body) {
  validateFields(body, ['name', 'email', 'password']);

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  return userRepository.create({
    name: body.name.trim(),
    email: normalizeEmail(body.email),
    passwordHash,
  });
}

async function login(body) {
  validateFields(body, ['email', 'password']);

  const user = await userRepository.findByEmail(normalizeEmail(body.email));
  const passwordMatches = user
    ? await bcrypt.compare(body.password, user.passwordHash)
    : false;

  if (!passwordMatches) {
    throw createAuthError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  return user;
}

module.exports = { register, login };
