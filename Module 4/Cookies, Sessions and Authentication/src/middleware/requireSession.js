const { COOKIE_NAME } = require('../config/cookieConfig');
const sessionStore = require('../session/sessionStore');
const userRepository = require('../repositories/userRepository');

function unauthorized(res) {
  return res.status(401).json({
    error: {
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    },
  });
}

module.exports = async function requireSession(req, res, next) {
  try {
    const sessionId = req.signedCookies?.[COOKIE_NAME];

    // cookie-parser returns false when a signed cookie has an invalid signature.
    if (!sessionId || typeof sessionId !== 'string') {
      return unauthorized(res);
    }

    const session = sessionStore.getSession(sessionId);

    if (!session) {
      return unauthorized(res);
    }

    const user = await userRepository.findUserById(session.userId);

    if (!user) {
      sessionStore.destroySession(sessionId);
      return unauthorized(res);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
