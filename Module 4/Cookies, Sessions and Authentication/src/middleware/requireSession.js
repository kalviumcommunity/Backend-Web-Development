const sessionStore = require('../session/sessionStore');
const users = require('../repositories/userRepository');

function deny(res) {
  return res.status(401).json({
    error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
  });
}

module.exports = async function requireSession(req, res, next) {
  try {
    const sid = req.signedCookies && req.signedCookies.sid; // false/undefined if missing or tampered
    const session = sid ? sessionStore.get(sid) : null;
    if (!session) return deny(res);

    const user = await users.findPublicById(session.userId);
    if (!user) {
      sessionStore.destroy(sid); // orphaned session
      return deny(res);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};