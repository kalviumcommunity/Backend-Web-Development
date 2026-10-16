function getCookieOptions() {
  const ttl = Number(process.env.SESSION_TTL_MS || 3600000);
  const secure = String(process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true';
  return {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: ttl,
  };
}

module.exports = { getCookieOptions };
