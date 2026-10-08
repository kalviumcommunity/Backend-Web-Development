// Explicit allowlist: a new column can never leak through this
const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

module.exports = { toPublicUser };
