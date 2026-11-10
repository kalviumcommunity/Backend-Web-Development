
const express = require('express');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');

const router = express.Router();

const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');
const cookieConfig = require('../config/cookie');

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password ||
      email.length > 254 ||
      password.length > 1024
    ) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Valid email and password are required'
        }
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findUserByEmail(normalizedEmail);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate an unpredictable opaque session ID.
    const sessionId = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + cookieConfig.ttl);

    // Store only userId and expiration on the server.
    sessionStore.create(sessionId, user.id, expiresAt);

    // Send only the signed session identifier in the cookie.
    res.cookie(cookieConfig.name, sessionId, cookieConfig.options);

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /auth/me
router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({
    user: req.user
  });
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies?.sid;

  if (typeof sessionId === 'string') {
    sessionStore.destroy(sessionId);
  }

  res.clearCookie(cookieConfig.name, cookieConfig.clearOptions);

  return res.status(204).end();
});

module.exports = router;
