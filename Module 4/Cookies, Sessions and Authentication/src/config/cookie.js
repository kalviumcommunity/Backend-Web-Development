
const ONE_HOUR = Number(process.env.SESSION_TTL_MS || 3600000);

if (!Number.isSafeInteger(ONE_HOUR) || ONE_HOUR <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure:
    process.env.NODE_ENV === 'production'
      ? true
      : process.env.COOKIE_SECURE === 'true',
  path: '/',
  maxAge: ONE_HOUR
};

module.exports = {
  name: 'sid',
  options: {
    ...cookieOptions,
    signed: true
  },
  clearOptions: {
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: cookieOptions.path,
    signed: true
  },
  ttl: ONE_HOUR
};
