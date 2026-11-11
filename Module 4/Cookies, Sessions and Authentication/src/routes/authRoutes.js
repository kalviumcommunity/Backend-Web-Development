const express = require('express');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const {
  SESSION_COOKIE_NAME,
  cookieOptions,
  clearCookieOptions,
} = require('../config/cookies');

const router = express.Router();

function invalidCredentials(res) {
  return res.status(401).json({
    error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
  });
}

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      });
    }

    const user = await userRepository.findByEmail(email);
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!passwordMatches) return invalidCredentials(res);

    const session = sessionStore.create(user.id);
    res.cookie(SESSION_COOKIE_NAME, session.id, cookieOptions());
    return res.status(200).json({ data: userRepository.publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({ data: req.user });
});

router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies && req.signedCookies[SESSION_COOKIE_NAME];
  if (typeof sessionId === 'string') sessionStore.destroy(sessionId);

  res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions());
  return res.status(204).send();
});

module.exports = router;
