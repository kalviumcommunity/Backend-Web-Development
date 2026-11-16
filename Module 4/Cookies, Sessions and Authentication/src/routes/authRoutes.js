const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('./prisma');

const router = express.Router();

// Session storage: session ID -> { userId, expiresAt }
const sessions = new Map();

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  signed: true,
  path: '/',
  maxAge: SESSION_DURATION,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  signed: true,
  path: '/',
};

function authRequired(res) {
  return res.status(401).json({
    error: {
      code: 'AUTH_REQUIRED',
      message: 'Authentication required',
    },
  });
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
  };
}

// POST /auth/login
router.post('/login', async (req, res) => {
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
          code: 'INVALID_INPUT',
          message: 'Email and password are required',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || typeof user.passwordHash !== 'string') {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate an unpredictable session ID.
    const sessionId = crypto.randomUUID();

    // Save identity only on the server.
    sessions.set(sessionId, {
      userId: user.id,
      expiresAt: Date.now() + SESSION_DURATION,
    });

    res.cookie('sid', sessionId, cookieOptions);

    return res.status(200).json({
      data: publicUser(user),
    });
  } catch (error) {
    console.error('Login failed');
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// GET /auth/me
router.get('/me', async (req, res) => {
  try {
    // Requires cookie-parser configured with COOKIE_SECRET.
    const sessionId = req.signedCookies?.sid;

    if (typeof sessionId !== 'string' || !sessionId) {
      return authRequired(res);
    }

    const session = sessions.get(sessionId);

    if (!session || session.expiresAt <= Date.now()) {
      sessions.delete(sessionId);
      return authRequired(res);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      sessions.delete(sessionId);
      return authRequired(res);
    }

    return res.status(200).json({
      data: publicUser(user),
    });
  } catch (error) {
    console.error('Identity lookup failed');
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  const sessionId = req.signedCookies?.sid;

  if (typeof sessionId === 'string' && sessionId) {
    sessions.delete(sessionId);
  }

  res.clearCookie('sid', clearCookieOptions);

  return res.status(204).send();
});

module.exports = router;