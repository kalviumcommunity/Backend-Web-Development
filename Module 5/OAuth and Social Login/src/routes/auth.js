
'use strict';

const express = require('express');
const { passport } = require('../auth/passport');
const { signToken } = require('../utils/jwt');

const router = express.Router();

// Start Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
    session: false,
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  (req, res) => {
    const token = signToken({
      sub: req.user.id,
      role: req.user.role,
    });

    return res.json({ token });
  }
);

module.exports = router;
