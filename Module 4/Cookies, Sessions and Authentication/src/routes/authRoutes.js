const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  path: '/auth',
};

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'Email and password are required' },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const sessionId = sessionStore.create(user.id);
    return res
      .cookie('sid', sessionId, {
        ...cookieOptions,
        signed: true,
        maxAge: sessionStore.SESSION_TTL_MS,
      })
      .status(200)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies?.sid;
  if (typeof sessionId === 'string') {
    sessionStore.destroy(sessionId);
  }

  res.clearCookie('sid', cookieOptions).status(200).json({ message: 'Logged out' });
});

module.exports = router;
