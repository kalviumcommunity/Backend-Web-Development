const bcrypt = require('bcryptjs');
const userRepository = require('./repositories/userRepository');

const INVALID_CREDENTIALS = {
  error: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function register({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error('EMAIL_ALREADY_EXISTS');
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepository.createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return serializeUser(user);
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(normalizeEmail(email));
  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    const error = new Error('INVALID_CREDENTIALS');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  return serializeUser(user);
}

module.exports = {
  INVALID_CREDENTIALS,
  login,
  normalizeEmail,
  register,
  serializeUser,
};
