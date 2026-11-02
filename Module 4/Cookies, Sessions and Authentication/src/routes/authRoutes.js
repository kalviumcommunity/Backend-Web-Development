
const express = require('express');
const bcrypt = require('bcryptjs');

const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

// Keep cookie settings consistent for login and logout.
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  signed: true,
  path: '/',
  maxAge: 60 * 60 * 1000,
};

function sendAuthError(res) {
  return res.status(401).json({
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    },
  });
}

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return sendAuthError(res);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepository.findUserByEmail(normalizedEmail);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return sendAuthError(res);
    }

    const session = sessionStore.create(user.id);

    res.cookie('sid', session.id, cookieOptions);

    return res.status(200).json({
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /auth/me
router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});

// POST /auth/logout
router.post('/logout', (req, res, next) => {
  try {
    const sid = req.signedCookies?.sid;

    if (typeof sid === 'string') {
      sessionStore.destroy(sid);
    }

    res.clearCookie('sid', {
      httpOnly: cookieOptions.httpOnly,
      sameSite: cookieOptions.sameSite,
      secure: cookieOptions.secure,
      path: cookieOptions.path,
    });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
