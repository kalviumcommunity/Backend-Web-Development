const userRepository = require('../db/userRepository');
const sessionStore = require('../session/sessionStore');

function authRequired(res) {
  return res.status(401).json({
    error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
  });
}

module.exports = function requireSession(req, res, next) {
  const sid = req.signedCookies.sid;
  const session = sessionStore.get(sid);

  if (!session) return authRequired(res);

  userRepository.findPublicById(session.userId)
    .then((user) => {
      if (!user) {
        sessionStore.destroy(sid);
        return authRequired(res);
      }
      req.user = user;
      req.sessionId = sid;
      return next();
    })
    .catch(next);
};
