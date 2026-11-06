'use strict';

// routes/auth.js — OAuth entry points

const router = require('express').Router();

const { passport } = require('../auth/passport');

const { signToken } = require('../utils/jwt');

// Route 1 — GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
    session: false,
  }),
);

// Route 2 — GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    // Generate application JWT
    const token = signToken({
      sub: req.user.id,
      role: req.user.role,
    });

    // Send JWT response
    res.json({ token });
  },
);

// Route 3 — GET /auth/failure
router.get('/failure', (_req, res) => {
  res.status(401).json({
    error: {
      code: 'OAUTH_FAILED',
      message: 'Google login failed or was denied',
    },
  });
});

// Export router
module.exports = router;