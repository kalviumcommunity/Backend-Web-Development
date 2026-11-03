
const verifyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    // 1. Find returning OAuth user by Google ID
    let user = users.find((u) => u.googleId === googleId);

    if (user) {
      return done(null, user);
    }

    // 2. Find existing local account by email
    user = users.find((u) => u.email === email);

    if (user) {
      // Link only if Google verified the email
      if (!profile._json.email_verified) {
        return done(null, false);
      }

      user.googleId = googleId;
      return done(null, user);
    }

    // 3. Create a new member
    const newUser = {
      id: nextId(),
      googleId,
      email,
      name,
      role: "member",
    };

    users.push(newUser);

    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
};

module.exports = { verifyCallback };
