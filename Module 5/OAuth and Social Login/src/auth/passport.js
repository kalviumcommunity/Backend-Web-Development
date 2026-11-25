
'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

// Verify Google profile and find, link, or create a user
async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;

    // 1. Check returning Google user first
    let user = users.find((u) => u.googleId === googleId);

    if (user) {
      return done(null, user);
    }

    // 2. Check existing local account by email
    user = users.find((u) => u.email === email);

    if (user) {
      // Link only if Google confirms the email
      if (profile._json.email_verified === true) {
        user.googleId = googleId;
        return done(null, user);
      }

      // Reject unverified email
      return done(null, false);
    }

    // 3. Create a brand-new user
    const newUser = {
      id: nextId(),
      googleId: googleId,
      email: email,
      name: profile.displayName,
      role: 'member',
    };

    users.push(newUser);

    return done(null, newUser);

  } catch (err) {
    return done(err);
  }
}

// Configure Google Strategy
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

// Export for tests
module.exports = { passport, verifyCallback };
