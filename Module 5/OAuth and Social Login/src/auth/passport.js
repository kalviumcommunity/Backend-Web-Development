'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // 1. RETURNING OAuth user
    let user = users.find((u) => u.googleId === googleId);

    if (user) {
      return done(null, user);
    }

    // 2. EXISTING local account
    user = users.find((u) => u.email === email);

    if (user) {
      // Link only if Google has verified the email
      if (profile._json.email_verified === true) {
        user.googleId = googleId;
        return done(null, user);
      }

      // Reject unverified email
      return done(null, false);
    }

    // 3. BRAND-NEW user
    const newUser = {
      id: nextId(),
      googleId: googleId,
      email: email,
      name: name,
      role: 'member',
    };

    users.push(newUser);

    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'test-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret',
      callbackURL: '/auth/google/callback',
    },
    verifyCallback,
  ),
);

// verifyCallback is exported so tests can call it directly without a real browser.
module.exports = { passport, verifyCallback };