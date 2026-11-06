'use strict';

// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

// Verify Google user
async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // 1. Returning OAuth user
    let user = users.find((u) => u.googleId === googleId);

    if (user) {
      return done(null, user);
    }

    // 2. Existing local account
    user = users.find((u) => u.email === email);

    if (user) {
      // Check whether Google has verified the email
      if (!profile._json.email_verified) {
        return done(null, false);
      }

      // Link Google account
      user.googleId = googleId;

      return done(null, user);
    }

    // 3. Brand-new user
    const newUser = {
      id: nextId(),
      googleId,
      email,
      name,
      role: 'member',
    };

    // Save new user
    users.push(newUser);

    return done(null, newUser);

  } catch (err) {
    return done(err);
  }
}

// Google OAuth Strategy
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

// Export passport and verifyCallback
module.exports = { passport, verifyCallback };