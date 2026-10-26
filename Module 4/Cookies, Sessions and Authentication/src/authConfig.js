const isProduction = process.env.NODE_ENV === 'production';
const secure = isProduction || process.env.COOKIE_SECURE === 'true';
const sessionTtlMs = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);

if (!Number.isSafeInteger(sessionTtlMs) || sessionTtlMs <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    signed: true,
    path: '/',
    maxAge: sessionTtlMs,
  };
}

function clearCookieOptions() {
  const { maxAge, ...options } = cookieOptions();
  return options;
}

module.exports = { sessionTtlMs, cookieOptions, clearCookieOptions };
