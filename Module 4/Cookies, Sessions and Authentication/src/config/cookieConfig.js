const sessionTtl = Number(process.env.SESSION_TTL_MS || 3600000);

if (!Number.isSafeInteger(sessionTtl) || sessionTtl <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure:
    process.env.NODE_ENV === 'production' ||
    process.env.COOKIE_SECURE === 'true',
  path: '/',
  maxAge: sessionTtl,
};

module.exports = {
  COOKIE_NAME: 'sid',
  SESSION_TTL_MS: sessionTtl,
  cookieOptions,
};
