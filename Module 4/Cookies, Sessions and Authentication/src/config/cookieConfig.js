function sessionTtlMs() {
  return Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    signed: true,
    path: '/',
    maxAge: sessionTtlMs(),
  };
}

// Same options as login, minus maxAge, so the browser matches and clears the cookie
function clearCookieOptions() {
  const { maxAge, ...rest } = cookieOptions();
  return rest;
}

module.exports = { sessionTtlMs, cookieOptions, clearCookieOptions };