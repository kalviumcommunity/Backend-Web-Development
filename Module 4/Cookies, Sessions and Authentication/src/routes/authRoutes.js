const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const { getCookieOptions } = require('../session/cookieOptions');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

function toSafeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Email and password are required' } });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    const hashToCheck = user
      ? user.passwordHash
      : '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinva1';
    const passwordOk = await bcrypt.compare(password, hashToCheck);
    if (!user || !passwordOk) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }
    const sid = sessionStore.create(user.id);
    res.cookie('sid', sid, getCookieOptions());
    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.post('/logout', async (req, res, next) => {
  try {
    const sid = req.signedCookies && req.signedCookies.sid;
    if (sid) {
      sessionStore.destroy(sid);
    }
    res.clearCookie('sid', getCookieOptions());
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

