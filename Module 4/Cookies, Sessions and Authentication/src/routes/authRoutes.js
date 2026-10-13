const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

const AUTH_REQUIRED = {
  error: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
  },
};

const INVALID_CREDENTIALS = {
  error: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
  },
};

function cookieOptions() {
  const secure = process.env.COOKIE_SECURE === 'true';

  return {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    signed: true,
    path: '/',
    maxAge: 60 * 60 * 1000,
  };
}

function validateRequiredString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: `${fieldName} is required`,
      },
    };
  }

  return null;
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const emailError = validateRequiredString(email, 'Email');
    if (emailError) return res.status(400).json(emailError);

    const passwordError = validateRequiredString(password, 'Password');
    if (passwordError) return res.status(400).json(passwordError);

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json(INVALID_CREDENTIALS);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json(INVALID_CREDENTIALS);
    }

    const session = sessionStore.create(user.id);
    res.cookie('sid', session.id, cookieOptions());

    return res.status(200).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, async (req, res, next) => {
  try {
    return res.status(200).json({
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const sid = req.signedCookies?.sid;
    if (sid) {
      sessionStore.destroy(sid);
    }

    res.clearCookie('sid', {
      ...cookieOptions(),
      expires: new Date(0),
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
