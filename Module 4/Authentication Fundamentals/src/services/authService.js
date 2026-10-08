const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { AppError, invalidCredentials } = require('../utils/errors');
const { requireStrings, normalizeEmail } = require('../utils/validate');
const { toPublicUser } = require('../utils/serializers');

const COST = Number(process.env.BCRYPT_COST) || 12;

// Valid bcrypt hash used when the email is unknown, so both failures take similar time
let dummyHashPromise;
const getDummyHash = () => (dummyHashPromise ??= bcrypt.hash('dummy-password-for-timing', COST));

const emailExists = () =>
  new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists');

async function register(body) {
  requireStrings(body, ['name', 'email', 'password']);
  const email = normalizeEmail(body.email);

  if (await userRepository.findByEmail(email)) throw emailExists();

  const passwordHash = await bcrypt.hash(body.password, COST);

  try {
    const user = await userRepository.create({
      name: body.name.trim(),
      email,
      passwordHash,
    });
    return toPublicUser(user);
  } catch (error) {
    if (error.code === 'P2002') throw emailExists(); // race: unique constraint hit
    throw error;
  }
}

async function login(body) {
  requireStrings(body, ['email', 'password']);
  const email = normalizeEmail(body.email);

  const user = await userRepository.findByEmail(email);
  if (!user) {
    await bcrypt.compare(body.password, await getDummyHash());
    throw invalidCredentials();
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) throw invalidCredentials();

  return toPublicUser(user);
}

module.exports = { register, login };
