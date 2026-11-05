const express = require('express');
const bcrypt = require('bcryptjs');
const sessions = require('../session/sessionStore');
const users = require('../db/userRepository');
const requireSession = require('../middleware/requireSession');
const { cookieOptions } = require('../config/cookieConfig');

const router = express.Router();
const unauthorized = (res) => res.status(401).json({
  error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
});

router.post('/login', async (req, res, next) => {
  const body = req.body;
  if (
    !body ||
    typeof body.email !== 'string' ||
    typeof body.password !== 'string' ||
    body.email.trim().length === 0 ||
    body.email.trim().length > 254 ||
    body.password.length === 0 ||
    body.password.length > 1024
  ) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'A valid email and password are required' },
    });
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'A valid email and password are required' },
    });
  }

  try {
    const user = await users.findByEmail(email);
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return unauthorized(res);
    }

    const session = sessions.create(user.id);
    res.cookie('sid', session.id, { ...cookieOptions, signed: true });
    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireSession, (req, res) => {
  res.status(200).json({ user: req.authenticatedUser });
});

router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies && req.signedCookies.sid;
  if (typeof sessionId === 'string') sessions.destroy(sessionId);

  const clearOptions = { ...cookieOptions, signed: true };
  delete clearOptions.maxAge;
  res.clearCookie('sid', clearOptions);
  return res.status(204).end();
});

module.exports = router;
