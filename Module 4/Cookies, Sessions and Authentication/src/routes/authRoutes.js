const express = require('express');
const bcrypt = require('bcryptjs');

const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const {
  COOKIE_NAME,
  cookieOptions,
} = require('../config/cookieConfig');

const router = express.Router();

function invalidCredentials(res) {
  return res.status(401).json({
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    },
  });
}

router.post('/login', async (req, res, next) => {
  try {
    const email =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body?.password === 'string'
        ? req.body.password
        : '';

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    const user = await userRepository.findUserByEmail(email);

    // Use the same response for an unknown email and a wrong password.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return invalidCredentials(res);
    }

    const { sessionId } = sessionStore.createSession(user.id);

    res.cookie(COOKIE_NAME, sessionId, {
      ...cookieOptions,
      signed: true,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies?.[COOKIE_NAME];

  if (typeof sessionId === 'string') {
    sessionStore.destroySession(sessionId);
  }

  // Clear using the same cookie attributes used when setting it.
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie(COOKIE_NAME, clearOptions);

  return res.status(204).end();
});

module.exports = router;
