router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    // Generate your application's JWT
    const token = signToken({
      sub: req.user.id,
      role: req.user.role,
    });

    // Return the JWT as JSON
    res.json({ token });
  },
);