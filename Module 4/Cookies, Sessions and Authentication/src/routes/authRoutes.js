const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();
const cookieName = 'sid';
const ttlMs = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
const secure = process.env.COOKIE_SECURE === 'true';
const cookieOptions = {
  httpOnly: true,
  secure,
  sameSite: 'lax',
  signed: true,
  path: '/',
  maxAge: ttlMs,
};
const clearCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: 'lax',
  signed: true,
  path: '/',
};
const authRequired = { error: { code: 'AUTH_REQUIRED', message: 'Authentication required' } };

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const user = email && password
      ? await prisma.user.findUnique({ where: { email } })
      : null;
    const valid = user && await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json(authRequired);

    const session = sessionStore.create(user.id);
    res.cookie(cookieName, session.id, cookieOptions);
    return res.status(200).json({
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireSession, (req, res) => {
  res.status(200).json({ data: req.user });
});

router.post('/logout', (req, res) => {
  const sid = req.signedCookies && req.signedCookies[cookieName];
  sessionStore.destroy(sid);
  res.clearCookie(cookieName, clearCookieOptions);
  return res.status(204).send();
});

module.exports = router;
