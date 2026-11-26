'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

// ─── Implemented verifyCallback ────────────────────────────────────────────────

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails?.[0]?.value;
    const emailVerified = profile._json?.email_verified === true;
    const name = profile.displayName;

    // 1. RETURNING OAuth user
    // Check whether this Google account is already linked.
    const existingOAuthUser = users.find(
      (u) => u.googleId === profile.id
    );

    if (existingOAuthUser) {
      return done(null, existingOAuthUser);
    }

    // 2. EXISTING local account (first-time Google login)
    // Find an existing account using the email address.
    const existingLocalUser = email
      ? users.find((u) => u.email === email)
      : undefined;

    if (existingLocalUser) {

      // Only link accounts when Google's email is verified.
      if (emailVerified) {
        existingLocalUser.googleId = profile.id;
        return done(null, existingLocalUser);
      }

      // Reject unverified email to prevent account hijacking.
      return done(null, false);
    }

    // 3. BRAND-NEW user
    // Create a new account with the default member role.
    const newUser = {
      id: nextId(),
      googleId: profile.id,
      email,
      name,
      role: 'member',
    };

    users.push(newUser);

    return done(null, newUser);

  } catch (err) {
    return done(err);
  }
}

// ─── Google OAuth Strategy ────────────────────────────────────────────────────

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

// Export passport and verifyCallback for testing.
module.exports = { passport, verifyCallback };