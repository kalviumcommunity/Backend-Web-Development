const cookieSecret = process.env.COOKIE_SECRET;

if (
  !cookieSecret ||
  cookieSecret.length < 32 ||
  /replace[-_]with/i.test(cookieSecret)
) {
  throw new Error('COOKIE_SECRET must be set to at least 32 characters');
}

const ttlValue = process.env.SESSION_TTL_MS || '3600000';
const sessionTtlMs = Number(ttlValue);
if (!Number.isSafeInteger(sessionTtlMs) || sessionTtlMs <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

const secureValue = process.env.COOKIE_SECURE;
if (secureValue !== undefined && secureValue !== 'true' && secureValue !== 'false') {
  throw new Error('COOKIE_SECURE must be "true" or "false"');
}

const secure = secureValue === undefined
  ? process.env.NODE_ENV === 'production'
  : secureValue === 'true';

if (process.env.NODE_ENV === 'production' && !secure) {
  throw new Error('COOKIE_SECURE must be true in production');
}

const cookieOptions = Object.freeze({
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure,
  maxAge: sessionTtlMs,
});

module.exports = { cookieSecret, cookieOptions, sessionTtlMs };
