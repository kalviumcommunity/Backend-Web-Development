'use strict';


const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');


async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;


    // 1. Returning Google user
    const existingGoogleUser = users.find(
      (user) => user.googleId === googleId
    );


    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }


    // 2. Existing local account
    const existingUser = users.find(
      (user) => user.email === email
    );


    if (existingUser) {
      if (profile._json.email_verified !== true) {
        return done(null, false);
      }


      existingUser.googleId = googleId;
      return done(null, existingUser);
    }


    // 3. Brand-new user
    const newUser = {
      id: nextId(),
      googleId,
      email,
      name,
      role: 'member',
    };


    users.push(newUser);


    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}


module.exports = { passport, verifyCallback };