
const sessionStore = require('../session/sessionStore');
const userRepository = require('../repositories/userRepository');

module.exports = async function requireSession(req, res, next) {
  try {
    const sid = req.signedCookies?.sid;

    // Missing or invalid signed cookies are not authenticated.
    if (!sid || typeof sid !== 'string') {
      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    // Resolve the cookie's opaque ID through the server-side session store.
    const session = sessionStore.get(sid);

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    const user = await userRepository.findPublicById(session.userId);

    // A session for a deleted user must not remain valid.
    if (!user) {
      sessionStore.destroy(sid);

      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
