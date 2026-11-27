
'use strict';

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const email = profile.emails[0].value;

    // 1. Find returning Google user by Google ID
    const existingGoogleUser = users.find(
      (user) => user.googleId === profile.id
    );

    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }

    // 2. Find existing local account by email
    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      if (profile._json.email_verified === true) {
        existingUser.googleId = profile.id;
        return done(null, existingUser);
      }

      return done(null, false);
    }

    // 3. Create a new user
    const newUser = {
      id: nextId(),
      googleId: profile.id,
      email: email,
      name: profile.displayName,
      role: 'member',
    };

    users.push(newUser);

    return done(null, newUser);
  } catch (error) {
    return done(error);
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

module.exports = { passport, verifyCallback };
