'use strict';

// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const { users, nextId } = require('../data');

// Verify Google OAuth callback
async function verifyCallback(accessToken, refreshToken, profile, done) {
  const email = profile.emails[0].value;

  // 1. RETURNING OAuth user
  const existingGoogleUser = users.find(
    (user) => user.googleId === profile.id
  );

  if (existingGoogleUser) {
    return done(null, existingGoogleUser);
  }

  // 2. EXISTING local account
  const existingLocalUser = users.find(
    (user) => user.email === email
  );

  if (existingLocalUser) {
    if (profile._json.email_verified === true) {
      existingLocalUser.googleId = profile.id;
      return done(null, existingLocalUser);
    }

    return done(null, false);
  }

  // 3. BRAND-NEW user
  const newUser = {
    id: nextId(),
    googleId: profile.id,
    email: email,
    name: profile.displayName,
    role: 'member',
  };

  users.push(newUser);

  return done(null, newUser);
}

// Configure Google OAuth strategy
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