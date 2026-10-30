
'use strict';

// Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // 1. RETURNING OAuth user
    const googleUser = users.find((user) => user.googleId === googleId);

    if (googleUser) {
      return done(null, googleUser);
    }

    // 2. EXISTING local account
    const emailUser = users.find((user) => user.email === email);

    if (emailUser) {
      if (profile._json.email_verified === true) {
        emailUser.googleId = googleId;
        return done(null, emailUser);
      }

      return done(null, false);
    }

    // 3. BRAND-NEW user
    const newUser = {
      id: nextId(),
      googleId: googleId,
      email: email,
      name: name,
      role: 'member'
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

// Export for tests
module.exports = { passport, verifyCallback };
