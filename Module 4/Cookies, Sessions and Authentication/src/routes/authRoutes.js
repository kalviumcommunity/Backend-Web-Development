const express = require('express');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const {
  clearCookieOptions,
  cookieName,
  cookieOptions,
} = require('../config/sessionConfig');

const router = express.Router();
const invalidCredentials = {
  error: { code: 'AUTH_REQUIRED', message: 'Invalid email or password' },
};

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim().length === 0 ||
    email.trim().length > 254 ||
    password.length === 0 ||
    password.length > 1024 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      error: { code: 'INVALID_REQUEST', message: 'A valid email and password are required' },
    });
  }

  const user = await userRepository.findByEmailForAuthentication(email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json(invalidCredentials);
  }

  const session = sessionStore.create(user.id);
  const publicUser = { id: user.id, name: user.name, email: user.email };
  res.cookie(cookieName, session.id, cookieOptions);
  return res.status(200).json({ data: publicUser });
});

router.get('/me', requireSession, (req, res) => res.status(200).json({ data: req.user }));

router.post('/logout', (req, res) => {
  const id = req.signedCookies[cookieName];
  if (typeof id === 'string') sessionStore.destroy(id);

  res.clearCookie(cookieName, clearCookieOptions);
  return res.status(204).send();
});

module.exports = router;
