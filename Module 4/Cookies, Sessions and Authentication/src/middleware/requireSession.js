const sessionStore = require('../session/sessionStore');
const userRepository = require('../repositories/userRepository');
const { SESSION_COOKIE_NAME } = require('../config/cookies');

function authRequired(res) {
  return res.status(401).json({
    error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
  });
}

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies && req.signedCookies[SESSION_COOKIE_NAME];
    if (!sessionId || typeof sessionId !== 'string') return authRequired(res);

    const session = sessionStore.get(sessionId);
    if (!session) return authRequired(res);

    const user = await userRepository.findPublicById(session.userId);
    if (!user) {
      sessionStore.destroy(sessionId);
      return authRequired(res);
    }

    req.user = user;
    req.sessionId = sessionId;
    return next();
  } catch {
    return authRequired(res);
  }
};
