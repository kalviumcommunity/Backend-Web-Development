

// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

// Google OAuth verification callback
async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const emailVerified = profile._json?.email_verified;

    // Check if email exists
    if (!email) {
      return done(null, false);
    }

    // 1. RETURNING OAuth user
    const existingGoogleUser = users.find(
      (user) => user.googleId === googleId
    );

    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }

    // 2. EXISTING local account
    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      if (!emailVerified) {
        return done(null, false);
      }

      existingUser.googleId = googleId;

      return done(null, existingUser);
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

// Export Passport and callback
module.exports = { passport, verifyCallback };
