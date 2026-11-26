const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { sessions, users } = require('../data');

const COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
};

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const sid = crypto.randomUUID();

    sessions.set(sid, {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    res.cookie('sid', sid, COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
});

// Protected identity
router.get('/me', async (req, res, next) => {
  try {
    const sid = req.signedCookies?.sid;
    const session = sid && sessions.get(sid);

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required'
        }
      });
    }

    return res.status(200).json({
      user: session.user
    });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const sid = req.signedCookies?.sid;

    if (sid) {
      sessions.delete(sid);
    }

    res.clearCookie('sid', COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Logout successful'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;