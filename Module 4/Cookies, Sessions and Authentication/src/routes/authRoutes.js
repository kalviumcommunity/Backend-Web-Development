const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');

const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/',
};

function getSessionTtlMs() {
  const ttl = Number(process.env.SESSION_TTL_MS || 60 * 60 * 1000);
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 60 * 60 * 1000;
}

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required.' },
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    const ttlMs = getSessionTtlMs();
    sessionStore.createSession(sessionId, user.id, Date.now() + ttlMs);

    res.cookie('sid', sessionId, {
      ...cookieOptions,
      signed: true,
      maxAge: ttlMs,
    });

    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.post('/logout', async (req, res, next) => {
  try {
    const sessionId = req.signedCookies?.sid;
    if (sessionId) {
      sessionStore.destroySession(sessionId);
    }

    res.clearCookie('sid', {
      ...cookieOptions,
      signed: true,
    });

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
