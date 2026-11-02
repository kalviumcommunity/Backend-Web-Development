const userRepository = require('../repositories/userRepository');
const sessionStore = require('../session/sessionStore');
const { cookieName } = require('../config/sessionConfig');

module.exports = async function requireSession(req, res, next) {
  const id = req.signedCookies[cookieName];
  const session = typeof id === 'string' ? sessionStore.get(id) : null;
  if (!session) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }

  const user = await userRepository.findPublicById(session.userId);
  if (!user) {
    sessionStore.destroy(id);
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
    });
  }

  req.user = user;
  return next();
};
