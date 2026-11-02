const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret || cookieSecret.length < 32) {
  throw new Error('COOKIE_SECRET must contain at least 32 characters');
}

const sessionTtlMs = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
if (!Number.isSafeInteger(sessionTtlMs) || sessionTtlMs <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

const secureSetting = process.env.COOKIE_SECURE || 'false';
if (secureSetting !== 'true' && secureSetting !== 'false') {
  throw new Error('COOKIE_SECURE must be either "true" or "false"');
}

const cookieName = 'sid';
const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: secureSetting === 'true',
  sameSite: 'lax',
  signed: true,
  path: '/',
  maxAge: sessionTtlMs,
});
const clearCookieOptions = Object.freeze({
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
  signed: cookieOptions.signed,
  path: cookieOptions.path,
});

module.exports = {
  clearCookieOptions,
  cookieName,
  cookieOptions,
  sessionTtlMs,
};
