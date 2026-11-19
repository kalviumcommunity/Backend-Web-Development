const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const requireSession = require('../middleware/requireSession');
const sessionStore = require('../session/sessionStore');

const router = express.Router();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  path: '/auth',
};

router.post('/login', async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
  }

  const sessionId = sessionStore.create(user.id);
  res.cookie('sid', sessionId, {
    ...cookieOptions,
    maxAge: sessionStore.ttlMs,
    signed: true,
  });
  return res.status(200).json({
    user: { id: user.id, name: user.name, email: user.email },
  });
});

router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies && req.signedCookies.sid;
  if (typeof sessionId === 'string') sessionStore.destroy(sessionId);

  res.clearCookie('sid', cookieOptions);
  return res.status(204).end();
});

module.exports = router;
