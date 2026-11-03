async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    // 1. Returning OAuth user
    const existingGoogleUser = users.find((user) => user.googleId === profile.id);
    if (existingGoogleUser) {
      return done(null, existingGoogleUser);
    }

    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;
    const emailVerified = profile._json?.email_verified;

    // 2. Existing local account
    const existingLocalUser = users.find((user) => user.email === email);
    if (existingLocalUser) {
      if (!emailVerified) {
        return done(null, false);
      }

      existingLocalUser.googleId = profile.id;
      return done(null, existingLocalUser);
    }

    // 3. Brand-new user
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