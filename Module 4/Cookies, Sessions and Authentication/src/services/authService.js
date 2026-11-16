
const bcrypt = require('bcryptjs');
const AppError = require('../errors/appError');
const userRepository = require('../repositories/userRepository');

const requiredString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const invalidCredentials = () =>
  new AppError(
    401,
    'INVALID_CREDENTIALS',
    'Invalid email or password'
  );

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

async function verifyCredentials(input = {}) {
  if (
    !requiredString(input.email) ||
    !requiredString(input.password)
  ) {
    throw new AppError(
      400,
      'INVALID_INPUT',
      'Email and password are required'
    );
  }

  const email = input.email.trim().toLowerCase();
  const password = input.password;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw invalidCredentials();
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw invalidCredentials();
  }

  return publicUser(user);
}

module.exports = { verifyCredentials };
