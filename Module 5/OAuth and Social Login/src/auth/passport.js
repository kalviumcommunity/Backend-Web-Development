
'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    // 1. Returning Google user: match by Google ID first.
    const existingGoogleUser = users.find(
      (user) => user.googleId === profile.id
    );

    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }

    // 2. Existing local account: find by email.
    const email = profile.emails[0].value;

    const existingEmailUser = users.find(
      (user) => user.email === email
    );

    if (existingEmailUser) {
      // Link the account only if Google confirms the email.
      if (profile._json.email_verified === true) {
        existingEmailUser.googleId = profile.id;
        return done(null, existingEmailUser);
      }

      // Reject unverified email addresses.
      return done(null, false);
    }

    // 3. Brand-new user.
    const newUser = {
      id: nextId(),
      googleId: profile.id,
      email,
      name: profile.displayName,
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
    verifyCallback
  )
);

// Export for the application and tests.
module.exports = { passport, verifyCallback };
