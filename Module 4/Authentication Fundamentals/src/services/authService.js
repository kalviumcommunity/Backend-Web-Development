const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

function createAuthError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function validateRegistrationInput(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    typeof body.name !== 'string' ||
    !body.name.trim() ||
    typeof body.email !== 'string' ||
    !body.email.trim() ||
    typeof body.password !== 'string' ||
    !body.password.trim()
  ) {
    throw createAuthError(
      400,
      'VALIDATION_ERROR',
      'Name, email, and password are required'
    );
  }
}

function validateLoginInput(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    typeof body.email !== 'string' ||
    !body.email.trim() ||
    typeof body.password !== 'string' ||
    !body.password.trim()
  ) {
    throw createAuthError(
      400,
      'VALIDATION_ERROR',
      'Email and password are required'
    );
  }
}

async function register(input) {
  const { name, email, password } = input || {};
  validateRegistrationInput({ name, email, password });

  const normalizedEmail = normalizeEmail(email);
  const cost = Number(process.env.BCRYPT_COST || 12);

  const passwordHash = await bcrypt.hash(password, cost);

  try {
    const user = await userRepository.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    return serializeUser(user);
  } catch (error) {
    if (error.code === 'EMAIL_ALREADY_EXISTS') {
      throw createAuthError(
        409,
        'EMAIL_ALREADY_EXISTS',
        'An account with this email already exists'
      );
    }

    throw error;
  }
}

async function login(input) {
  const { email, password } = input || {};
  validateLoginInput({ email, password });

  const normalizedEmail = normalizeEmail(email);
  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throw createAuthError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid email or password'
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw createAuthError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid email or password'
    );
  }

  return serializeUser(user);
}

module.exports = {
  register,
  login
};
