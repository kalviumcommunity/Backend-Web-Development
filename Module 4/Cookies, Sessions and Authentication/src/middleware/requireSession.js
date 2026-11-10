
const sessionStore = require('../session/sessionStore');
const userRepository = require('../repositories/userRepository');

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies?.sid;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const session = sessionStore.get(sessionId);

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const user = await userRepository.findSafeUserById(session.userId);

    if (!user) {
      sessionStore.destroy(sessionId);

      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
