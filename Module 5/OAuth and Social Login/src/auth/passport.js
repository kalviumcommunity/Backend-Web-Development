async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
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
  } catch (err) {
    return done(err);
  }
}