async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;

    let user = users.find(u => u.googleId === googleId);
    if (user) return done(null, user);

    user = users.find(u => u.email === email);
    if (user) {
      if (!profile._json.email_verified) return done(null, false);
      user.googleId = googleId;
      return done(null, user);
    }

    const newUser = {
      id: nextId(),
      googleId,
      email,
      name: profile.displayName,
      role: 'member'
    };

    users.push(newUser);
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}