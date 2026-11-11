const cookieSecure = process.env.COOKIE_SECURE === 'true';

const SESSION_COOKIE_NAME = 'sid';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);

function cookieOptions() {
  return {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'lax',
    signed: true,
    path: '/',
    maxAge: SESSION_TTL_MS,
  };
}

function clearCookieOptions() {
  const { maxAge, ...options } = cookieOptions();
  return options;
}

module.exports = { SESSION_COOKIE_NAME, SESSION_TTL_MS, cookieOptions, clearCookieOptions };
