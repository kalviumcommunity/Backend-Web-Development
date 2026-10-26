const sessions = require('../session/sessionStore');
const users = require('../db/userRepository');

const unauthorized = (res) => res.status(401).json({
  error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
});

module.exports = async function requireSession(req, res, next) {
  const sessionId = req.signedCookies && req.signedCookies.sid;
  if (typeof sessionId !== 'string') return unauthorized(res);

  try {
    const session = sessions.get(sessionId);
    if (!session) return unauthorized(res);

    const user = await users.findIdentityById(session.userId);
    if (!user) {
      sessions.destroy(sessionId);
      return unauthorized(res);
    }

    req.authenticatedUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
