const express = require('express');
const bcrypt = require('bcryptjs');
const userRepository = require('../db/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const { cookieOptions, clearCookieOptions } = require('../authConfig');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(401).json({
        error: { code: 'AUTH_FAILED', message: 'Invalid email or password' },
      });
    }

    const user = await userRepository.findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        error: { code: 'AUTH_FAILED', message: 'Invalid email or password' },
      });
    }

    const session = sessionStore.create(user.id);
    res.cookie('sid', session.id, cookieOptions());
    return res.status(200).json({
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, (req, res) => res.status(200).json({ data: req.user }));

router.post('/logout', (req, res) => {
  sessionStore.destroy(req.signedCookies.sid);
  res.clearCookie('sid', clearCookieOptions());
  return res.status(204).send();
});

module.exports = router;
